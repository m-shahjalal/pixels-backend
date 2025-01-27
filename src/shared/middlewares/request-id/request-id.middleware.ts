import { Request, Response } from 'express';
import { createId, isCuid } from '@paralleldrive/cuid2';

import { REQUEST_ID_TOKEN_HEADER } from '../../constants';

export const RequestIdMiddleware = (
  req: Request,
  res: Response,
  next: () => void,
): void => {
  /** set request id, if not being set yet */
  const requestIdToken = req.header(REQUEST_ID_TOKEN_HEADER) || '';

  if (!requestIdToken || !isCuid(requestIdToken)) {
    req.headers[REQUEST_ID_TOKEN_HEADER] = createId();
  }

  /** set res id in response from req */
  res.set(REQUEST_ID_TOKEN_HEADER, req.headers[REQUEST_ID_TOKEN_HEADER]);
  next();
};
