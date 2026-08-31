import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('mirador', () => ({
  default: { viewer: vi.fn() },
}));

import { MapViewer } from '../src/index';
import Mirador from 'mirador';

const viewerMock = Mirador.viewer as unknown as Mock;

afterEach(() => {
  cleanup();
  viewerMock.mockClear();
});

describe('MapViewer', () => {
  it('initializes Mirador with the given manifestId', () => {
    render(<MapViewer manifestId="https://example.org/manifest.json" />);

    expect(viewerMock).toHaveBeenCalledTimes(1);
    const [config] = viewerMock.mock.calls[0];
    expect(config.windows).toEqual([{ manifestId: 'https://example.org/manifest.json' }]);
    expect(typeof config.id).toBe('string');
    expect(document.getElementById(config.id)).not.toBeNull();
  });

  it('does not throw when unmounted', () => {
    const { unmount } = render(<MapViewer manifestId="https://example.org/manifest.json" />);
    expect(() => unmount()).not.toThrow();
  });

  it('re-initializes Mirador when manifestId changes', () => {
    const { rerender } = render(<MapViewer manifestId="https://example.org/manifest-a.json" />);
    rerender(<MapViewer manifestId="https://example.org/manifest-b.json" />);

    expect(viewerMock).toHaveBeenCalledTimes(2);
    const secondCallArgs = viewerMock.mock.calls[1];
    expect(secondCallArgs[0].windows).toEqual([{ manifestId: 'https://example.org/manifest-b.json' }]);
  });
});
