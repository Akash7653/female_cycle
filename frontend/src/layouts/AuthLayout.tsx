import { Link, Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh dark:bg-ink-900">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="glass sticky top-0 z-20 border-b border-white/30 dark:border-white/10 px-4 py-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
            <Link to="/" className="btn-ghost rounded-full px-4 py-2 text-sm font-semibold">
              Home
            </Link>
          </div>
        </header>
        <div className="relative z-10 flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
