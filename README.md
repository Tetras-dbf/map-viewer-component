# dbf-map-viewer-component

React component wrapping [Mirador](https://github.com/ProjectMirador/mirador) to display IIIF maps and manifests in the front office.

A demo is available at [https://tetras-dbf.github.io/map-viewer-component](https://tetras-dbf.github.io/map-viewer-component).


## Usage

```tsx
import { MapViewer } from 'dbf-map-viewer-component';

function App() {
  return <MapViewer manifestId="https://example.org/manifest.json" />;
}
```

`MapViewer` requires `react`, `react-dom` (>=19), and `dbf-mirador` (>=4.2.3) as peer dependencies.

## Development

This package is developed inside the `Tetras-dbf/root_repo` monorepo, as a sibling
of the `mirador` submodule it depends on. `dbf-mirador` isn't published to npm yet
(tracked in `mirador#1`), so this package resolves it via a local path
(`"dbf-mirador": "file:../mirador"`).

Before running the demo, build `mirador` once:

```bash
cd ../mirador && npm install && npm run build && cd -
```

Then:

```bash
npm install
npm start        # dev server, opens the demo app
npm run build    # library build -> dist/
npm run build:demo  # static demo build -> dist-demo/
npm run lint
npm test
```
