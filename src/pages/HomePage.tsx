import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useDebounce } from '@/hooks/useDebounce';
import { useGreeting } from '@/features/hello/useGreeting';
import { ApiError } from '@/types/api';
import { formatDateTime } from '@/utils/format';

export function HomePage() {
  const [name, setName] = useState('');
  const debouncedName = useDebounce(name, 400);
  const { data, isPending, isError, error, refetch, isFetching } = useGreeting(
    debouncedName || undefined,
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Plantilla base de frontend
        </h1>
        <p className="max-w-2xl text-neutral-600 dark:text-neutral-400">
          React 19 + TypeScript + Vite + Tailwind, con TanStack Query ya conectado al{' '}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm dark:bg-neutral-800">
            GET /hello
          </code>{' '}
          de la API base de NestJS.
        </p>
      </section>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Tu nombre (opcional)
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Claude"
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-indigo-950"
          />
        </div>

        <div className="flex min-h-16 items-center rounded-lg bg-neutral-50 px-4 py-3 dark:bg-neutral-800/50">
          {isPending && (
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <Spinner />
              <span>Consultando la API...</span>
            </div>
          )}

          {isError && (
            <div className="flex w-full flex-col gap-2 text-red-600 dark:text-red-400">
              <p className="text-sm">
                {error instanceof ApiError
                  ? error.message
                  : 'No se pudo conectar con la API. ¿Está corriendo en VITE_API_BASE_URL?'}
              </p>
              <Button variant="secondary" className="self-start" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          )}

          {data && (
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                {data.message}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {formatDateTime(data.timestamp)} {isFetching && '· actualizando…'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
