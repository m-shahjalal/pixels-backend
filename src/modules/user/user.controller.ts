import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppLogger } from '@common/logger/logger.service';
import { ReqContext } from '@common/decorators/request-context.decorator';
import { RequestContext } from '@common/request-context/request-context.dto';
import { BaseApiResponse } from '@common/dtos/base-api-response.dto';
import { PaginationParamsDto } from '@common/dtos/pagination-params.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserController.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<User>> {
    const user = await this.userService.findById(ctx.user!.id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Post()
  async createUser(
    @ReqContext() ctx: RequestContext,
    @Body() createUserDto: CreateUserDto,
  ): Promise<BaseApiResponse<User>> {
    const user = await this.userService.create(createUserDto);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      data: user,
    };
  }

  @Get()
  async getUsers(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<{ users: User[]; count: number }>> {
    const { limit = 10, offset = 0 } = query;
    const { users, count } = await this.userService.getUsers(
      ctx,
      limit,
      offset,
    );
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: { users, count },
      meta: {
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
        },
      },
    };
  }

  @Get(':id')
  async getUserById(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<BaseApiResponse<User>> {
    const user = await this.userService.findById(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Put(':id')
  async updateUser(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<BaseApiResponse<User>> {
    const user = await this.userService.update(id, updateData);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      data: user,
    };
  }
}
