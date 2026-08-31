import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MetaBanner } from '../demo/MetaBanner';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('MetaBanner', () => {
  it('renders nothing while meta.json is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    const { container } = render(<MetaBanner />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('renders the deploy metadata once meta.json resolves', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            label: 'PR #42',
            branch: 'feat/demo-pages',
            commit: 'abcdef1234567',
            commit_url: 'https://example.org/commit/abcdef1',
            commit_message: 'Add demo pages',
            date: '2026-09-01T00:00:00Z',
            pr_url: 'https://example.org/pr/42',
          }),
      }),
    );

    const { findByText } = render(<MetaBanner />);

    expect(await findByText('PR #42')).not.toBeNull();
    expect(await findByText(/feat\/demo-pages/)).not.toBeNull();
    expect(await findByText('Add demo pages')).not.toBeNull();
    expect(await findByText(/abcdef1/)).not.toBeNull();
  });
});
