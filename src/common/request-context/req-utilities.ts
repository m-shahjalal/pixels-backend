import { Request } from 'express';
import { RequestContext } from './request-context.dto';

export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';
export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';

// Creates a RequestContext object from Request
export function createRequestContext(request: Request): RequestContext {
  const ctx = new RequestContext();

  ctx.requestID = request.header(REQUEST_ID_TOKEN_HEADER) || '';
  ctx.url = request.url;
  ctx.ip = request.header(FORWARDED_FOR_TOKEN_HEADER) || request.ip;

  return ctx;
}
