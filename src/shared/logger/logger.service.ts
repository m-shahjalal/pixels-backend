import { Injectable, Scope } from '@nestjs/common';
import { createLogger, Logger, transports, format } from 'winston';
import { RequestContext } from '../../utils/request-context/request-context.dto';
import { currentTime } from '../../utils/date-format';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  private context?: string;
  private logger: Logger;

  public setContext(context: string): void {
    this.context = context;
  }

  constructor() {
    const isDevelopment = process.env.NODE_ENV === 'development';

    const logFormat = isDevelopment
      ? format.printf((info) => `🚀 ${currentTime} - ${info.message}`)
      : format.combine(format.timestamp(), format.json());

    this.logger = createLogger({
      format: logFormat,
      transports: [new transports.Console()],
    });
  }

  error(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.error({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  warn(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.warn({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  debug(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.debug({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  verbose(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.verbose({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  log(
    ctx: RequestContext,
    message: string,
    meta?: Record<string, any>,
  ): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.info({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }
}
