import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    error?: string,
  ) {
    super(
      {
        statusCode,
        message,
        error: error || 'Bad Request',
      },
      statusCode,
    );
  }

  static badRequest(message: string, error?: string): AppException {
    return new AppException(message, HttpStatus.BAD_REQUEST, error);
  }

  static unauthorized(message: string, error?: string): AppException {
    return new AppException(message, HttpStatus.UNAUTHORIZED, error);
  }

  static forbidden(message: string, error?: string): AppException {
    return new AppException(message, HttpStatus.FORBIDDEN, error);
  }

  static notFound(message: string, error?: string): AppException {
    return new AppException(message, HttpStatus.NOT_FOUND, error);
  }

  static conflict(message: string, error?: string): AppException {
    return new AppException(message, HttpStatus.CONFLICT, error);
  }
}
