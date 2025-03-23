import { ResourceAction } from '@/common/enums/resource-action.enum';
import { ResourceModule } from '@/common/enums/resource-modules.enum';
import { Auth } from '@/modules/auth/decorators/auth.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleService } from '../services/role.service';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Auth(ResourceModule.ROLES, ResourceAction.CREATE)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Auth(ResourceModule.ROLES, ResourceAction.LIST)
  @ApiOperation({ summary: 'Get all roles' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Auth(ResourceModule.ROLES, ResourceAction.READ)
  @ApiOperation({ summary: 'Get a role by id' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Auth(ResourceModule.ROLES, ResourceAction.UPDATE)
  @ApiOperation({ summary: 'Update a role' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Auth(ResourceModule.ROLES, ResourceAction.DELETE)
  @ApiOperation({ summary: 'Delete a role' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @Post(':id/permissions')
  @Auth(ResourceModule.ROLES, ResourceAction.UPDATE)
  @ApiOperation({ summary: 'Assign permissions to a role' })
  assignPermissions(
    @Param('id') id: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.roleService.assignPermissions(id, assignPermissionsDto);
  }
}
