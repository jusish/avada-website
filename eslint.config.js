import js from '@eslint/js';
import ts from 'typescript-eslint';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/docker/**',
      '**/*.d.ts',
      '**/build/**',
      '**/.next/**',
    ],
  },
  {
    files: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  }
);
