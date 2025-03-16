import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError, TypeORMError, EntityNotFoundError } from 'typeorm';
import { AppLogger } from '../logger/logger.service';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    if (exception instanceof TypeORMError) {
      const databaseError = this.handleDatabaseError(exception, request.url);
      return httpAdapter.reply(
        ctx.getResponse(),
        databaseError,
        databaseError.statusCode,
      );
    }

    if (
      exception instanceof NotFoundException ||
      exception instanceof EntityNotFoundError
    ) {
      const notFoundError = this.handleNotFoundError(exception, request.url);
      return httpAdapter.reply(
        ctx.getResponse(),
        notFoundError,
        notFoundError.statusCode,
      );
    }

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const error =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            error: message,
            path: request.url,
            timestamp: new Date().toISOString(),
          };

    const errorResponse = { statusCode, success: false, message, error };
    httpAdapter.reply(ctx.getResponse(), errorResponse, statusCode);
  }

  private handleNotFoundError(exception: Error, url: string) {
    this.logger.warn(`Not found error: ${exception.message}`);

    let message = 'Resource not found';

    if (exception instanceof EntityNotFoundError) {
      const entityRegex = /Could not find any entity of type "(\w+)"/;
      const match = exception.message.match(entityRegex);
      if (match?.[1]) message = `${match[1].toLowerCase()} not found`;
    } else if (exception instanceof NotFoundException) {
      message = exception.message || 'Endpoint not found';
    }

    return {
      statusCode: HttpStatus.NOT_FOUND,
      success: false,
      message,
      error: {
        code: 'NOT_FOUND',
        detail: exception.message,
        path: url,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private handleDatabaseError(exception: TypeORMError, url: string) {
    this.logger.error(`Database error: ${exception.message}`, exception.stack);
    if (exception instanceof QueryFailedError) {
      const err = exception as any;

      this.logger.error(
        `Database error code: ${err.code}, detail: ${err.detail}`,
      );

      if (err.code === '23505') {
        return this.handleUniqueConstraintViolation(err, url);
      } else if (err.code === '23503') {
        return this.handleForeignKeyViolation(err, url);
      } else if (err.code === '23514') {
        return this.handleCheckConstraintViolation(err, url);
      } else if (err.code === '23502') {
        return this.handleNotNullViolation(err, url);
      }
    }

    return {
      statusCode: 400,
      success: false,
      message: 'Database error',
      error: {
        code: 'DATABASE_ERROR',
        detail: exception.message,
        path: url,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private handleUniqueConstraintViolation(err: any, url: string) {
    const match = err.detail.match(/Key \((.*?)\)=/);
    const field = match ? match[1] : 'field';

    return {
      statusCode: 409,
      success: false,
      message: `${field} already exists`,
      error: {
        code: 'DUPLICATE_ENTRY',
        detail: err.detail,
        path: url,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private handleForeignKeyViolation(err: any, url: string) {
    return {
      statusCode: 409,
      success: false,
      message: 'Foreign key violation',
      error: {
        code: 'FOREIGN_KEY_VIOLATION',
        detail: err.detail,
        path: url,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private handleCheckConstraintViolation(err: any, url: string) {
    return {
      statusCode: 400,
      success: false,
      message: 'Invalid data',
      error: {
        code: 'CHECK_VIOLATION',
        detail: err.detail,
        path: url,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private handleNotNullViolation(err: any, url: string) {
    return {
      statusCode: 400,
      success: false,
      message: 'Missing required field',
      error: {
        code: 'NOT_NULL_VIOLATION',
        detail: err.detail,
        path: url,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
