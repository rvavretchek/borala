import { Meta, Outlet, isRouteErrorResponse } from 'react-router';

import stylesheet from './styles/app.css?url';
import type { Route } from './+types/root';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link rel="stylesheet" href={stylesheet} />
      </head>
      <body>{children}</body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <>
      <main className="page-shell">
        <section className="surface" aria-labelledby="error-title">
          <p className="eyebrow">Bora Lá</p>
          <h1 id="error-title">
            {isNotFound
              ? 'Página não encontrada'
              : 'Não foi possível abrir esta página'}
          </h1>
          <p>
            {isNotFound
              ? 'Confira o endereço e tente novamente.'
              : 'Tente novamente em alguns instantes.'}
          </p>
        </section>
      </main>
    </>
  );
}
