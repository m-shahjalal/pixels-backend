import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        const meta: any = data?.meta?.pagination;
        const result = {
          statusCode: response.statusCode,
          success: true,
          message: data?.message || 'Success',
          data: data?.data || data,
        } as ApiResponse;

        if (meta) result.meta = meta;
        return result;
      }),
    );
  }
}
