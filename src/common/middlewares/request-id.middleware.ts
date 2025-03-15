import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { REQUEST_ID_TOKEN_HEADER } from '../constants';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Get request ID from header or generate a new one
    const requestId = req.header(REQUEST_ID_TOKEN_HEADER) || createId();

    // Set request ID to response header
    res.set(REQUEST_ID_TOKEN_HEADER, requestId);
    next();
  }
}
