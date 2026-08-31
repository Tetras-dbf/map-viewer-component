import { useEffect, useId, useState } from 'react';
import Mirador from 'mirador';

export interface MapViewerProps {
  manifestId: string;
  /** Reserved for a future annotation server integration. Unused in V0. */
  annotationServerUrl?: string;
}

export function MapViewer({ manifestId }: MapViewerProps) {
  const baseId = useId().replace(/:/g, '');
  const [instanceCount, setInstanceCount] = useState(0);
  const [prevManifestId, setPrevManifestId] = useState<string | undefined>(undefined);

  if (prevManifestId !== manifestId) {
    setPrevManifestId(manifestId);
    setInstanceCount((count) => count + 1);
  }

  const containerId = `map-viewer-${baseId}-${instanceCount}`;

  useEffect(() => {
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

  return <div key={containerId} id={containerId} />;
}
