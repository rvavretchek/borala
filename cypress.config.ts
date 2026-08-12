import { defineConfig } from 'cypress';

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
  },
});
