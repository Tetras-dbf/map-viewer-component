import { MapViewer } from '../src/index';
import { MetaBanner } from './MetaBanner';

const DEMO_MANIFEST_ID = 'https://iiif.io/api/cookbook/recipe/0019-html-in-annotations/manifest.json';

export function App() {
  return (
    <>
      <MapViewer manifestId={DEMO_MANIFEST_ID} />
      <MetaBanner />
    </>
  );
}
