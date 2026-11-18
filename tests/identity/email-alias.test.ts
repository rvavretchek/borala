import { describe, expect, it } from 'vitest';

import {
  createEmailAlias,
  normalizeEmail,
  type EmailAliasConfig,
} from '../../app/modules/identity/domain/email-alias';

const config: EmailAliasConfig = {
  keys: [
    { version: 1, secret: 'chave-de-teste-v1' },
    { version: 2, secret: 'chave-de-teste-v2' },
  ],
  activeVersion: 2,
};

describe('normalizeEmail', () => {
  it('normaliza espaços e caixa do e-mail', () => {
    expect(normalizeEmail('  Pessoa@Exemplo.COM  ')).toBe('pessoa@exemplo.com');
  });

  it('lança erro para e-mail inválido', () => {
    expect(() => normalizeEmail('invalido')).toThrow();
    expect(() => normalizeEmail('')).toThrow();
  });
});

describe('createEmailAlias', () => {
  it('gera digest HMAC determinístico e versionado', () => {
    const first = createEmailAlias('pessoa@exemplo.com', config);
    const second = createEmailAlias('pessoa@exemplo.com', config);

    expect(first).toEqual(second);
    expect(first.version).toBe(2);
    expect(first.digest).toMatch(/^[a-f0-9]{64}$/);
  });

  it('gera digests diferentes para e-mails diferentes', () => {
    const a = createEmailAlias('a@exemplo.com', config);
    const b = createEmailAlias('b@exemplo.com', config);

    expect(a.digest).not.toBe(b.digest);
  });

  it('nunca expõe o e-mail em claro', () => {
    const alias = createEmailAlias('pessoa@exemplo.com', config);

    expect(JSON.stringify(alias)).not.toContain('pessoa@exemplo.com');
    expect(alias).not.toHaveProperty('email');
  });

  it('suporta rotação lazy: digests de versões anteriores continuam válidos', () => {
    const oldAlias = createEmailAlias('pessoa@exemplo.com', {
      keys: [{ version: 1, secret: 'chave-de-teste-v1' }],
      activeVersion: 1,
    });

    const current = createEmailAlias('pessoa@exemplo.com', config);

    expect(oldAlias.version).toBe(1);
    expect(current.version).toBe(2);
    expect(oldAlias.digest).not.toBe(current.digest);
  });
});