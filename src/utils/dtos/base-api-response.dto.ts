import { Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseApiResponse<T> {
  @ApiProperty({ type: Number })
  public statusCode: number;

  @ApiProperty({ type: Boolean })
  public success: boolean;

  @ApiProperty({ type: String })
  public message: string;

  public data?: T;

  @ApiPropertyOptional({ type: Object })
  public meta?: any;
}

type ApiPropertyType =
  | string
  | Record<string, any>
  | Type<unknown>
  | [new (...args: any[]) => any]
  | undefined;

export function SwaggerBaseApiResponse<T extends ApiPropertyType>(
  type: T,
): typeof BaseApiResponse {
  class ExtendedBaseApiResponse<T> extends BaseApiResponse<T> {
    @ApiProperty({ type: type as any, required: false })
    declare public data?: T;
  }
  // NOTE : Overwrite the returned class name, otherwise whichever type calls this function in the last,
  // will overwrite all previous definitions. i.e., Swagger will have all response types as the same one.
  const isAnArray = Array.isArray(type) ? ' [ ] ' : '';
  Object.defineProperty(ExtendedBaseApiResponse, 'name', {
    value: `SwaggerBaseApiResponseFor ${type} ${isAnArray}`,
  });

  return ExtendedBaseApiResponse;
}

export class BaseApiErrorObject {
  @ApiProperty({ type: Number })
  public statusCode: number;

  @ApiProperty({ type: String })
  public message: string;

  @ApiPropertyOptional({ type: String })
  public localizedMessage: string;

  @ApiProperty({ type: String })
  public errorName: string;

  @ApiProperty({ type: Object })
  public details: unknown;

  @ApiProperty({ type: String })
  public path: string;

  @ApiProperty({ type: String })
  public requestId: string;

  @ApiProperty({ type: String })
  public timestamp: string;
}

export class BaseApiErrorResponse {
  @ApiProperty({ type: BaseApiErrorObject })
  public error: BaseApiErrorObject;
}
