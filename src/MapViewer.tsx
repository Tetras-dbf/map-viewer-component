import { useEffect, useId, useRef } from 'react';
import Mirador from 'mirador';

export interface MapViewerProps {
  manifestId: string;
  /** Reserved for a future annotation server integration. Unused in V0. */
  annotationServerUrl?: string;
}

export function MapViewer({ manifestId }: MapViewerProps) {
  const baseId = useId().replace(/:/g, '');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const instanceCountRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return undefined;
    }

    instanceCountRef.current += 1;
    const container = document.createElement('div');
    container.id = `map-viewer-${baseId}-${instanceCountRef.current}`;
    container.style.position = 'relative';
    container.style.height = '100%';
    wrapper.appendChild(container);

    const viewer = Mirador.viewer({
      id: container.id,
      windows: [{ manifestId }],
    });

    return () => {
      queueMicrotask(() => {
        viewer.unmount();
        container.remove();
      });
    };
  }, [baseId, manifestId]);

  return <div ref={wrapperRef} style={{ position: 'relative', height: '100%' }} />;
}
