import {
  Catch,
  HttpException,
  ExceptionFilter,
  Logger,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { TypeORMError, QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';
import { errorMessages } from '../../configs/messages';

export interface CustomExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}

@Catch(HttpException, TypeORMError)
export class AllExceptionFilter<T extends HttpException | TypeORMError>
  implements ExceptionFilter
{
  private readonly logger = new Logger();
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { method, originalUrl, query, headers, params, body } = request;
    const requestId = headers?.requestId;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      const message = exception.message.toLowerCase();
      if (['duplicate', 'unique constraint'].some((k) => message.includes(k))) {
        status = HttpStatus.BAD_REQUEST;
      }
    }

    try {
      const { statusCode, message, error }: CustomExceptionResponse =
        exception instanceof HttpException
          ? (exception.getResponse() as CustomExceptionResponse)
          : {
              statusCode: status,
              message: this.getReadableMessage(exception),
              error: exception.name,
            };

      const stack = exception.stack || message;

      this.logger.debug(
        `${method}: ${originalUrl};
        Params: ${JSON.stringify(params)};
        Query: ${JSON.stringify(query)};
        Body: ${JSON.stringify(body)};`,
        `[DEBUG] [${method}:- ${originalUrl}] {reqID: ${requestId}}`,
      );
      this.logger.error(
        JSON.stringify(exception),
        `ExceptionFilter [${originalUrl}]: {reqID: ${requestId}}`,
      );
      this.logger.error(
        JSON.stringify({ stack }),
        `ExceptionFilter-stack [${originalUrl}]: {reqID: ${requestId}}`,
      );

      response.status(status).json({
        statusCode,
        success: false,
        message: message || errorMessages.ERR0000.message,
        error,
      });
    } catch (error) {
      this.logger.error(
        JSON.stringify(error),
        `ExceptionFilter processing error: {reqID: ${requestId}}`,
      );
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: errorMessages.ERR0000.message,
        meta: {
          path: originalUrl,
          method,
          timestamp: new Date().toISOString(),
          error: 'Internal Server Error',
        },
      });
    }
  }

  private getReadableMessage(exception: any): string {
    if (exception instanceof QueryFailedError) {
      const message = exception.message.toLowerCase();
      if (
        message.includes('duplicate') ||
        message.includes('unique constraint')
      ) {
        return 'A record with this value already exists';
      }
    }
    return exception.message;
  }
}
