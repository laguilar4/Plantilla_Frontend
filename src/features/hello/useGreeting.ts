import { useQuery } from '@tanstack/react-query';
import { getGreeting } from './api';

export function useGreeting(name?: string) {
  return useQuery({
    queryKey: ['greeting', name ?? null],
    queryFn: () => getGreeting(name),
  });
}
