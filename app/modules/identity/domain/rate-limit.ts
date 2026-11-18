export interface RateLimitConfig {
  emailWindowMs: number;
  emailMaxPerWindow: number;
  emailMaxPerDay: number;
  ipWindowMs: number;
  ipMaxPerWindow: number;
  ipMaxPerDay: number;
  maxConcurrentChallenges: number;
  cooldownMs: number;
}

interface Bucket {
  timestamps: number[];
}

export interface RateLimiter {
  canIssue(emailDigest: string, ipDigest: string, now: number): boolean;
  recordIssue(emailDigest: string, ipDigest: string, now: number): void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function countInWindow(timestamps: number[], windowMs: number, now: number): number {
  const cutoff = now - windowMs;
  return timestamps.filter((t) => t >= cutoff).length;
}

export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  const emailBuckets = new Map<string, Bucket>();
  const ipBuckets = new Map<string, Bucket>();
  const lastIssueByEmail = new Map<string, number>();

  function getBucket(map: Map<string, Bucket>, key: string): Bucket {
    let bucket = map.get(key);
    if (!bucket) {
      bucket = { timestamps: [] };
      map.set(key, bucket);
    }
    return bucket;
  }

  return {
    canIssue(emailDigest, ipDigest, now) {
      const emailBucket = getBucket(emailBuckets, emailDigest);
      const ipBucket = getBucket(ipBuckets, ipDigest);

      const emailWindowCount = countInWindow(
        emailBucket.timestamps,
        config.emailWindowMs,
        now,
      );
      const emailDayCount = countInWindow(
        emailBucket.timestamps,
        DAY_MS,
        now,
      );
      const ipWindowCount = countInWindow(
        ipBucket.timestamps,
        config.ipWindowMs,
        now,
      );
      const ipDayCount = countInWindow(ipBucket.timestamps, DAY_MS, now);

      const lastIssue = lastIssueByEmail.get(emailDigest);
      const cooldownOk = lastIssue === undefined || now - lastIssue >= config.cooldownMs;

      return (
        emailWindowCount < config.emailMaxPerWindow &&
        emailDayCount < config.emailMaxPerDay &&
        ipWindowCount < config.ipMaxPerWindow &&
        ipDayCount < config.ipMaxPerDay &&
        emailWindowCount < config.maxConcurrentChallenges &&
        cooldownOk
      );
    },
    recordIssue(emailDigest, ipDigest, now) {
      const emailBucket = getBucket(emailBuckets, emailDigest);
      const ipBucket = getBucket(ipBuckets, ipDigest);

      emailBucket.timestamps.push(now);
      ipBucket.timestamps.push(now);
      lastIssueByEmail.set(emailDigest, now);
    },
  };
}