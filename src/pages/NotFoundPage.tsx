import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">404</p>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        Página no encontrada
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400">
        La ruta que buscas no existe o fue movida.
      </p>
      <Button onClick={() => window.history.back()}>Volver</Button>
      <Link to="/" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        Ir al inicio
      </Link>
    </div>
  );
}
