import { useEffect, useId } from 'react';
import Mirador from 'mirador';

export interface MapViewerProps {
  manifestId: string;
  /** Reserved for a future annotation server integration. Unused in V0. */
  annotationServerUrl?: string;
}

export function MapViewer({ manifestId }: MapViewerProps) {
  const containerId = `map-viewer-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (container) {
      container.replaceChildren();
    }

    Mirador.viewer({
      id: containerId,
      windows: [{ manifestId }],
    });

    return () => {
      const cleanupContainer = document.getElementById(containerId);
      if (cleanupContainer) {
        cleanupContainer.replaceChildren();
      }
    };
  }, [containerId, manifestId]);

  return <div id={containerId} />;
}
