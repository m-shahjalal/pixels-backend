import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../utils/dtos/base-api-response.dto';
import { AppLogger } from '../shared/logger/logger.service';
import { ReqContext } from '../utils/request-context/req-context.decorator';
import { RequestContext } from '../utils/request-context/request-context.dto';
import { AuthService } from './auth.service';
import { RegisterInput } from './dtos/auth-register-input.dto';
import { RegisterOutput } from './dtos/auth-register-output.dto';
import { AuthTokenOutput } from './dtos/auth-token-output.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LoginInput } from './dtos/auth-login-input.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Get } from '@nestjs/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(Boolean),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async checkAuth(): Promise<BaseApiResponse<boolean>> {
    return {
      data: true,
      statusCode: HttpStatus.OK,
      success: true,
      message: 'User is authenticated',
    };
  }
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login API' })
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @Body() input: LoginInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const authToken = await this.authService.login(input);
    return {
      data: authToken,
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Login successful',
    };
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(RegisterOutput),
  })
  @Post('register')
  @ApiOperation({ summary: 'User registration API' })
  async registerLocal(
    @Body() input: RegisterInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    await this.authService.register(input);
    return this.login({ email: input.email, password: input.password });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Refresh access token API' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async refreshToken(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const authToken = await this.authService.refreshToken(ctx);
    return {
      data: authToken,
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Token refreshed successfully',
    };
  }
}
