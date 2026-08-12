import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return ['.ts', '.tsx'].includes(extname(path)) ? [path] : [];
  });
}

describe('fronteiras de imports', () => {
  it('não permite infraestrutura em rotas ou UI', () => {
    const appDirectory = join(root, 'app');
    expect(statSync(appDirectory).isDirectory()).toBe(true);

    const violations = sourceFiles(appDirectory)
      .filter((path) => /[\\/](routes|ui)[\\/]/.test(path))
      .filter((path) =>
        /from\s+['"][^'"]*server[\\/]/.test(readFileSync(path, 'utf8')),
      )
      .map((path) => relative(root, path));

    expect(violations).toEqual([]);
  });
});
