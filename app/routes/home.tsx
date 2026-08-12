import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [
  { title: 'Bora Lá' },
  {
    name: 'description',
    content:
      'Uma forma simples de organizar um rolê sem substituir a conversa do grupo.',
  },
];

export default function Home() {
  return (
    <main className="page-shell">
      <header className="brand-signature">
        <img src="/borala-logo.svg" alt="Bora Lá" width="61" height="69" />
      </header>
      <section className="surface" aria-labelledby="home-title">
        <p className="eyebrow">Organização compartilhada</p>
        <h1 id="home-title">Bora Lá</h1>
        <p className="purpose">
          Ajuda grupos a organizar um rolê sem substituir a conversa nem decidir
          pelo grupo.
        </p>
      </section>
    </main>
  );
}
