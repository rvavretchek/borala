import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.react-router/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '.agents/**',
      '.claude/**',
      '.obsidian/**',
      '.qwen/**',
      '_bmad/**',
      '_bmad-output/**',
      'design-artifacts/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['app/root.tsx', 'app/routes/**/*.{ts,tsx}', 'app/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/server/**'],
              message:
                'Código de UI e rotas não deve importar infraestrutura diretamente.',
            },
          ],
        },
      ],
    },
  },
);
