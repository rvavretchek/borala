import { PassThrough } from 'node:stream';

import { createReadableStreamFromReadable } from '@react-router/node';
import { ServerRouter } from 'react-router';
import type { EntryContext } from 'react-router';
import { renderToPipeableStream } from 'react-dom/server';

import { createDocumentSecurity } from './server/security/document-security.server';

// O framework usa `streamTimeout` para decidir entre `onShellReady` e
// `onAllReady`. Esta história entrega o documento completo por SSR, por isso
// sempre se espera `onAllReady`; o timeout real coincide com o export.
export const streamTimeout = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  const security = createDocumentSecurity({
    isValidatedHttps: process.env.BORALA_VALIDATED_HTTPS === 'true',
  });

  for (const [name, value] of security.headers) {
    responseHeaders.set(name, value);
  }

  if (request.method.toUpperCase() === 'HEAD') {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }

  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(
      () => abort(),
      streamTimeout,
    );

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter
        context={routerContext}
        url={request.url}
        nonce={security.nonce}
      />,
      {
        nonce: security.nonce,
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = undefined;
              callback();
            },
          });
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html; charset=utf-8');
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
        },
        onShellError(error: unknown) {
          clearTimeout(timeoutId);
          timeoutId = undefined;
          reject(error);
        },
        onError() {
          responseStatusCode = 500;
          // Não se registra o objeto de erro: pode conter URL, cabeçalhos ou
          // dados sensibles. A história exige que nenhum log inclua dado
          // pessoal ou token (AC6).
          if (shellRendered) {
            console.error('Erro durante o renderizado SSR');
          }
        },
      },
    );
  });
}
