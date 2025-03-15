import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestContext } from '../request-context/request-context.dto';
import { createRequestContext } from '../request-context/req-utilities';

export const ReqContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();
    return createRequestContext(request);
  },
);
