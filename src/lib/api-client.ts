import axios, { type AxiosError } from 'axios';
import { env } from '@/config/env';
import { ApiError, type ApiErrorResponse, type ApiSuccessResponse } from '@/types/api';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Unwraps the { success, data } envelope so callers work with plain data,
// and rethrows a typed ApiError built from the API's error envelope.
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as ApiSuccessResponse<unknown>;
    response.data = body?.data ?? body;
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.data && typeof error.response.data === 'object') {
      return Promise.reject(new ApiError(error.response.data));
    }
    return Promise.reject(error);
  },
);

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<T>(url, { params });
  return response.data;
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.post<T>(url, body);
  return response.data;
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.patch<T>(url, body);
  return response.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await apiClient.delete<T>(url);
  return response.data;
}
