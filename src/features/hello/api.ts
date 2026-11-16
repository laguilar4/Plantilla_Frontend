import { apiGet } from '@/lib/api-client';

export interface Greeting {
  message: string;
  timestamp: string;
}

export function getGreeting(name?: string): Promise<Greeting> {
  return apiGet<Greeting>('/hello', name ? { name } : undefined);
}
