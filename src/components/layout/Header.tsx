import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          Frontend Base
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
