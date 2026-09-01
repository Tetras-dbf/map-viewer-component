import { describe, expect, it } from 'vitest';
import { buildMeta } from '../scripts/write-deploy-meta.mjs';

describe('buildMeta', () => {
  it('builds meta for a main build with no PR url', () => {
    const meta = buildMeta({
      label: 'main',
      branch: 'main',
      prUrl: undefined,
      repository: 'Tetras-dbf/map-viewer-component',
      commit: 'abc1234567',
      date: '2026-09-01T00:00:00+00:00',
      commitMessage: 'Add demo pages',
    });

    expect(meta).toEqual({
      label: 'main',
      branch: 'main',
      commit: 'abc1234567',
      commit_url: 'https://github.com/Tetras-dbf/map-viewer-component/commit/abc1234567',
      commit_message: 'Add demo pages',
      date: '2026-09-01T00:00:00+00:00',
      pr_url: null,
    });
  });

  it('includes pr_url for a PR build', () => {
    const meta = buildMeta({
      label: 'PR #42',
      branch: 'feat/demo-pages',
      prUrl: 'https://github.com/Tetras-dbf/map-viewer-component/pull/42',
      repository: 'Tetras-dbf/map-viewer-component',
      commit: 'def7890123',
      date: '2026-09-02T00:00:00+00:00',
      commitMessage: 'Add preview',
    });

    expect(meta.pr_url).toBe('https://github.com/Tetras-dbf/map-viewer-component/pull/42');
  });

  it('throws when label is missing', () => {
    expect(() =>
      buildMeta({
        label: undefined,
        branch: 'main',
        prUrl: undefined,
        repository: 'Tetras-dbf/map-viewer-component',
        commit: 'abc',
        date: '2026-01-01T00:00:00Z',
        commitMessage: 'x',
      }),
    ).toThrow('label is required');
  });
});
