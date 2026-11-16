/**
 * Mirrors the response envelope produced by the NestJS API base
 * (TransformInterceptor / AllExceptionsFilter in ../Api/src/common).
 */
export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  path: string;
  timestamp: string;
  message: string | string[];
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly path?: string;

  constructor(response: ApiErrorResponse) {
    const message = Array.isArray(response.message)
      ? response.message.join(', ')
      : response.message;
    super(message);
    this.name = 'ApiError';
    this.statusCode = response.statusCode;
    this.path = response.path;
  }
}
