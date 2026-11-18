import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export interface ChallengeConfig {
  ttlMs: number;
  maxAttempts: number;
}

export interface LoginChallenge {
  id: string;
  linkToken: string;
  linkDigest: string;
  /** Código em claro — apenas em memória para envio por e-mail; nunca persistir. */
  code: string;
  codeDigest: string;
  expiresAt: number;
  attempts: number;
}

export interface PersistedLoginChallenge {
  id: string;
  linkDigest: string;
  codeDigest: string;
  expiresAt: number;
  attempts: number;
}

export function toPersisted(
  challenge: LoginChallenge,
): PersistedLoginChallenge {
  return {
    id: challenge.id,
    linkDigest: challenge.linkDigest,
    codeDigest: challenge.codeDigest,
    expiresAt: challenge.expiresAt,
    attempts: challenge.attempts,
  };
}

export interface ChallengeVerification {
  valid: boolean;
  reason: 'ok' | 'expired' | 'max_attempts' | 'invalid_code';
}

const CODE_SECRET = 'code-hmac-secret';
const LINK_SECRET = 'link-hmac-secret';

function digest(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

function generateCode(): string {
  return String(randomBytes(4).readUInt32BE(0) % 1_000_000).padStart(6, '0');
}

export function createChallenge(config: ChallengeConfig): LoginChallenge {
  const id = randomBytes(16).toString('hex');
  const linkToken = randomBytes(32).toString('base64url');
  const code = generateCode();

  return {
    id,
    linkToken,
    linkDigest: digest(linkToken, LINK_SECRET),
    code,
    codeDigest: digest(code, CODE_SECRET),
    expiresAt: Date.now() + config.ttlMs,
    attempts: 0,
  };
}

export function verifyChallenge(
  challenge: LoginChallenge,
  code: string,
  now: number,
): ChallengeVerification {
  if (now > challenge.expiresAt) {
    return { valid: false, reason: 'expired' };
  }
  if (challenge.attempts >= 5) {
    return { valid: false, reason: 'max_attempts' };
  }

  const expected = Buffer.from(challenge.codeDigest, 'hex');
  const actual = Buffer.from(digest(code, CODE_SECRET), 'hex');
  const valid =
    expected.length === actual.length && timingSafeEqual(expected, actual);

  return valid
    ? { valid: true, reason: 'ok' }
    : { valid: false, reason: 'invalid_code' };
}

export function hashLinkToken(linkToken: string): string {
  return createHash('sha256').update(linkToken).digest('hex');
}