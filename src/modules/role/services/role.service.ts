import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '@/common/entities/role.entity';
import { Permission } from '@/common/entities/permission.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['permissions'],
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }

  async assignPermissions(
    id: string,
    assignPermissionsDto: AssignPermissionsDto,
  ): Promise<Role> {
    const role = await this.findOne(id);
    const permissions = await this.permissionRepository.findBy({
      id: In(assignPermissionsDto.permissionIds),
    });

    if (permissions.length !== assignPermissionsDto.permissionIds.length) {
      throw new NotFoundException('Some permissions were not found');
    }

    role.permissions = permissions;
    return this.roleRepository.save(role);
  }

  async hasPermission(
    roleIds: string[],
    resource: string,
    action: string,
  ): Promise<boolean> {
    const roles = await this.roleRepository.find({
      where: { id: In(roleIds) },
      relations: ['permissions'],
    });

    return roles.some((role) =>
      role.permissions.some(
        (permission) =>
          permission.resource === resource && permission.action === action,
      ),
    );
  }
}
