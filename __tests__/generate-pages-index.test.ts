import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateIndexHtml, listEntries } from '../scripts/generate-pages-index.mjs';

describe('listEntries', () => {
  it('reads main and pr-* directories with meta.json, sorted with main first then numeric PR order', () => {
    const siteDir = mkdtempSync(join(tmpdir(), 'pages-index-'));
    try {
      const fixtures = {
        'pr-10': {
          label: 'PR #10', branch: 'feat/x', commit: 'abc1234', commit_url: 'https://example.org/commit/abc1234',
          commit_message: 'x', date: '2026-01-01T00:00:00Z', pr_url: 'https://example.org/pr/10',
        },
        main: {
          label: 'main', branch: 'main', commit: 'def5678', commit_url: 'https://example.org/commit/def5678',
          commit_message: 'y', date: '2026-01-02T00:00:00Z', pr_url: null,
        },
        'pr-2': {
          label: 'PR #2', branch: 'feat/y', commit: 'ghi9012', commit_url: 'https://example.org/commit/ghi9012',
          commit_message: 'z', date: '2026-01-03T00:00:00Z', pr_url: 'https://example.org/pr/2',
        },
      };

      for (const [name, meta] of Object.entries(fixtures)) {
        mkdirSync(join(siteDir, name));
        writeFileSync(join(siteDir, name, 'meta.json'), JSON.stringify(meta));
      }

      const entries = listEntries(siteDir);

      expect(entries.map((entry) => entry.path)).toEqual(['main', 'pr-2', 'pr-10']);
    } finally {
      rmSync(siteDir, { recursive: true, force: true });
    }
  });

  it('skips directories without a valid meta.json', () => {
    const siteDir = mkdtempSync(join(tmpdir(), 'pages-index-'));
    try {
      mkdirSync(join(siteDir, 'pr-5'));

      expect(listEntries(siteDir)).toEqual([]);
    } finally {
      rmSync(siteDir, { recursive: true, force: true });
    }
  });
});

describe('generateIndexHtml', () => {
  it('renders a card per entry with a link to its path and escapes HTML in commit messages', () => {
    const html = generateIndexHtml([
      {
        path: 'main',
        label: 'main',
        branch: 'main',
        commit: 'abcdef1234567',
        commit_url: 'https://example.org/commit/abcdef1',
        commit_message: '<script>alert(1)</script>',
        date: '2026-01-01T00:00:00Z',
        pr_url: null,
      },
    ]);

    expect(html).toContain('href="./main/"');
    expect(html).toContain('abcdef1');
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('renders a placeholder when there are no entries', () => {
    const html = generateIndexHtml([]);
    expect(html).toContain('No deployments yet.');
  });
});
