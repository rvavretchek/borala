import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import Home from '../../app/routes/home';

describe('home SSR', () => {
  it('renderiza marca, propósito e estrutura sem depender de hidratação', () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain('<main');
    expect(html).toContain('Bora Lá');
    expect(html).toContain('organizar um rolê');
    expect(html).toContain('alt="Bora Lá"');
    expect(html).not.toContain('<a');
  });
});
