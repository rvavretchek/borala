import { describe, expect, it } from 'vitest';

import {
  createRateLimiter,
  type RateLimitConfig,
} from '../../app/modules/identity/domain/rate-limit';

const config: RateLimitConfig = {
  emailWindowMs: 15 * 60 * 1000,
  emailMaxPerWindow: 3,
  emailMaxPerDay: 10,
  ipWindowMs: 15 * 60 * 1000,
  ipMaxPerWindow: 20,
  ipMaxPerDay: 100,
  maxConcurrentChallenges: 3,
  cooldownMs: 60 * 1000,
};

describe('createRateLimiter', () => {
  it('permite emissão dentro dos limites', () => {
    const limiter = createRateLimiter(config);
    const now = Date.now();

    expect(limiter.canIssue('email-digest', 'ip-digest', now)).toBe(true);
  });

  it('bloqueia após exceder o limite por janela de e-mail', () => {
    const limiter = createRateLimiter(config);
    const now = Date.now();

    limiter.recordIssue('email-digest', 'ip-digest', now);
    limiter.recordIssue('email-digest', 'ip-digest', now + 1000);
    limiter.recordIssue('email-digest', 'ip-digest', now + 2000);

    expect(limiter.canIssue('email-digest', 'ip-digest', now + 3000)).toBe(
      false,
    );
  });

  it('aplica cooldown de 60 segundos entre envios', () => {
    const limiter = createRateLimiter(config);
    const now = Date.now();

    limiter.recordIssue('email-digest', 'ip-digest', now);

    expect(limiter.canIssue('email-digest', 'ip-digest', now + 30_000)).toBe(
      false,
    );
    expect(limiter.canIssue('email-digest', 'ip-digest', now + 61_000)).toBe(
      true,
    );
  });

  it('bloqueia após exceder o limite diário de e-mail', () => {
    const limiter = createRateLimiter(config);
    const now = Date.now();

    for (let i = 0; i < 10; i++) {
      limiter.recordIssue('email-digest', 'ip-digest', now + i * 60_000);
    }

    expect(limiter.canIssue('email-digest', 'ip-digest', now + 11 * 60_000)).toBe(
      false,
    );
  });

  it('bloqueia após exceder o limite por janela de IP', () => {
    const limiter = createRateLimiter(config);
    const now = Date.now();

    for (let i = 0; i < 20; i++) {
      limiter.recordIssue('outro-email', 'ip-digest', now + i * 1000);
    }

    expect(limiter.canIssue('outro-email', 'ip-digest', now + 21_000)).toBe(
      false,
    );
  });

  it('limita a três desafios simultâneos válidos por e-mail', () => {
    const limiter = createRateLimiter(config);
    const now = Date.now();

    limiter.recordIssue('email-digest', 'ip-digest', now);
    limiter.recordIssue('email-digest', 'ip-digest', now + 61_000);
    limiter.recordIssue('email-digest', 'ip-digest', now + 122_000);

    expect(limiter.canIssue('email-digest', 'ip-digest', now + 183_000)).toBe(
      false,
    );
  });
});