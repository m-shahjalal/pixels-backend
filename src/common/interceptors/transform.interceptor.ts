import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
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
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((responseData) => {
        // Check if response contains data property
        const data =
          responseData?.data !== undefined ? responseData.data : responseData;

        // Extract meta if exists
        const meta = responseData?.meta;

        const transformedResponse: ApiResponse<T> = {
          statusCode,
          success: true,
          message: 'Success',
          data,
        };

        // Add meta if exists
        if (meta) {
          transformedResponse.meta = meta;
        }

        return transformedResponse;
      }),
    );
  }
}
