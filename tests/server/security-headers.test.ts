import { describe, expect, it } from 'vitest';

import {
  createDocumentSecurity,
  type DocumentSecurityOptions,
} from '../../app/server/security/document-security.server';

const options: DocumentSecurityOptions = {
  isValidatedHttps: false,
};

describe('document security', () => {
  it('gera nonce por resposta e cabeçalhos mínimos sem HSTS local', () => {
    const first = createDocumentSecurity(options);
    const second = createDocumentSecurity(options);

    expect(first.nonce).not.toBe(second.nonce);
    expect(first.headers.get('Content-Security-Policy')).toContain(
      `'nonce-${first.nonce}'`,
    );
    expect(first.headers.get('Content-Security-Policy')).toContain(
      "frame-ancestors 'none'",
    );
    expect(first.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(first.headers.get('Referrer-Policy')).toBe('no-referrer');
    expect(first.headers.get('Permissions-Policy')).toBe(
      'camera=(), microphone=(), geolocation=()',
    );
    expect(first.headers.has('Strict-Transport-Security')).toBe(false);
  });

  it('habilita HSTS somente quando o domínio HTTPS foi validado', () => {
    const security = createDocumentSecurity({ isValidatedHttps: true });

    expect(security.headers.get('Strict-Transport-Security')).toBe(
      'max-age=31536000; includeSubDomains',
    );
  });

  it('reutiliza o nonce fornecido pelo renderizador do documento', () => {
    const security = createDocumentSecurity({
      isValidatedHttps: false,
      nonce: 'nonce-do-documento',
    });

    expect(security.nonce).toBe('nonce-do-documento');
    expect(security.headers.get('Content-Security-Policy')).toContain(
      "'nonce-nonce-do-documento'",
    );
  });
});
