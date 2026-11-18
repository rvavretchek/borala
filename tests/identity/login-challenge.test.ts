import { describe, expect, it } from 'vitest';

import {
  createChallenge,
  toPersisted,
  verifyChallenge,
  type ChallengeConfig,
} from '../../app/modules/identity/domain/login-challenge';

const config: ChallengeConfig = {
  ttlMs: 10 * 60 * 1000,
  maxAttempts: 5,
};

describe('createChallenge', () => {
  it('gera link de 32 bytes e código decimal de seis dígitos', () => {
    const challenge = createChallenge(config);

    expect(challenge.linkToken.length).toBe(43); // base64url de 32 bytes
    expect(challenge.code).toMatch(/^\d{6}$/);
  });

  it('gera desafios distintos a cada chamada', () => {
    const a = createChallenge(config);
    const b = createChallenge(config);

    expect(a.linkToken).not.toBe(b.linkToken);
    expect(a.code).not.toBe(b.code);
  });

  it('mantém o código em claro apenas em memória e não no objeto persistível', () => {
    const challenge = createChallenge(config);
    const persisted = toPersisted(challenge);

    expect(challenge.code).toMatch(/^\d{6}$/);
    expect(persisted).not.toHaveProperty('code');
    expect(persisted).not.toHaveProperty('linkToken');
    expect(persisted).toHaveProperty('codeDigest');
    expect(persisted).toHaveProperty('linkDigest');
  });
});

describe('verifyChallenge', () => {
  it('valida código correto dentro do TTL', () => {
    const challenge = createChallenge(config);
    const now = Date.now();

    expect(verifyChallenge(challenge, challenge.code, now)).toEqual({
      valid: true,
      reason: 'ok',
    });
  });

  it('rejeita código incorreto', () => {
    const challenge = createChallenge(config);
    const now = Date.now();

    expect(verifyChallenge(challenge, '000000', now)).toEqual({
      valid: false,
      reason: 'invalid_code',
    });
  });

  it('rejeita desafio expirado', () => {
    const challenge = createChallenge(config);
    const now = Date.now() + config.ttlMs + 1;

    expect(verifyChallenge(challenge, challenge.code, now)).toEqual({
      valid: false,
      reason: 'expired',
    });
  });
});