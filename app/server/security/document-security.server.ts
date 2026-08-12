import { randomBytes } from 'node:crypto';

export interface DocumentSecurityOptions {
  isValidatedHttps: boolean;
  nonce?: string;
}

export interface DocumentSecurity {
  headers: Headers;
  nonce: string;
}

export function createDocumentSecurity({
  isValidatedHttps,
  nonce = randomBytes(16).toString('base64'),
}: DocumentSecurityOptions): DocumentSecurity {
  const directives = [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
  ];
  const headers = new Headers({
    'Content-Security-Policy': directives.join('; '),
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });

  if (isValidatedHttps) {
    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );
  }

  return { headers, nonce };
}
