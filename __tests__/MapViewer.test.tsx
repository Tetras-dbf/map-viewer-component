import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('mirador', () => ({
  default: { viewer: vi.fn(() => ({ unmount: vi.fn() })) },
}));

import { MapViewer } from '../src/index';
import Mirador from 'mirador';

const viewerMock = Mirador.viewer as unknown as Mock;

function unmountMockFor(callIndex: number) {
  return (viewerMock.mock.results[callIndex].value as { unmount: Mock }).unmount;
}

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

  it('unmounts the previous Mirador viewer when unmounted', async () => {
    const { unmount } = render(<MapViewer manifestId="https://example.org/manifest.json" />);
    const firstUnmount = unmountMockFor(0);

    expect(() => unmount()).not.toThrow();
    await Promise.resolve();

    expect(firstUnmount).toHaveBeenCalledTimes(1);
  });

  it('re-initializes Mirador with a fresh container and unmounts the previous viewer when manifestId changes', async () => {
    const { rerender } = render(<MapViewer manifestId="https://example.org/manifest-a.json" />);
    const firstUnmount = unmountMockFor(0);
    const firstContainerId = viewerMock.mock.calls[0][0].id;

    rerender(<MapViewer manifestId="https://example.org/manifest-b.json" />);
    await Promise.resolve();

    expect(viewerMock).toHaveBeenCalledTimes(2);
    const secondCallArgs = viewerMock.mock.calls[1];
    expect(secondCallArgs[0].windows).toEqual([{ manifestId: 'https://example.org/manifest-b.json' }]);
    expect(secondCallArgs[0].id).not.toBe(firstContainerId);
    expect(firstUnmount).toHaveBeenCalledTimes(1);
  });
});
