import { createHmac, timingSafeEqual } from 'node:crypto';

export interface EmailAliasKey {
  version: number;
  secret: string;
}

export interface EmailAliasConfig {
  keys: EmailAliasKey[];
  activeVersion: number;
}

export interface EmailAlias {
  version: number;
  digest: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(input: string): string {
  const normalized = input.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(normalized)) {
    throw new Error('E-mail inválido');
  }
  return normalized;
}

function digestFor(email: string, key: EmailAliasKey): string {
  return createHmac('sha256', key.secret).update(email).digest('hex');
}

export function createEmailAlias(
  email: string,
  config: EmailAliasConfig,
): EmailAlias {
  const normalized = normalizeEmail(email);
  const key = config.keys.find((k) => k.version === config.activeVersion);
  if (!key) {
    throw new Error(`Chave HMAC ativa ${config.activeVersion} não encontrada`);
  }
  return { version: key.version, digest: digestFor(normalized, key) };
}

export function verifyEmailAlias(
  email: string,
  alias: EmailAlias,
  config: EmailAliasConfig,
): boolean {
  const normalized = normalizeEmail(email);
  const key = config.keys.find((k) => k.version === alias.version);
  if (!key) {
    return false;
  }
  const expected = Buffer.from(digestFor(normalized, key), 'hex');
  const actual = Buffer.from(alias.digest, 'hex');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}