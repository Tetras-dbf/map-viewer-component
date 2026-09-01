#!/usr/bin/env node
// Regenerates the GitHub Pages landing page (index.html) at the root of a
// checked-out gh-pages branch, by scanning for a "main" directory and any
// "pr-<number>" directories, each expected to contain a meta.json written
// by write-deploy-meta.mjs. Static Pages hosting has no directory listing
// endpoint, so the list of live previews must be baked into the generated
// HTML at generation time, not fetched dynamically by client-side JS.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function readEntry(siteDir, name) {
  const metaPath = join(siteDir, name, 'meta.json');
  try {
    const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
    return { path: name, ...meta };
  } catch {
    return null;
  }
}

export function listEntries(siteDir) {
  const names = readdirSync(siteDir).filter((name) => {
    if (name !== 'main' && !/^pr-\d+$/.test(name)) {
      return false;
    }
    return statSync(join(siteDir, name)).isDirectory();
  });

  const entries = names.map((name) => readEntry(siteDir, name)).filter((entry) => entry !== null);

  entries.sort((a, b) => {
    if (a.path === 'main') return -1;
    if (b.path === 'main') return 1;
    return Number(a.path.slice('pr-'.length)) - Number(b.path.slice('pr-'.length));
  });

  return entries;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderCard(entry) {
  const shortSha = (entry.commit || '').slice(0, 7);
  const prLink = entry.pr_url
    ? ` · <a href="${escapeHtml(entry.pr_url)}" target="_blank" rel="noopener noreferrer">PR</a>`
    : '';

  return `
    <div class="card">
      <h2><a href="./${escapeHtml(entry.path)}/">${escapeHtml(entry.label)}</a></h2>
      <div class="muted">Branch: <code>${escapeHtml(entry.branch)}</code>${prLink}</div>
      <div class="muted">Commit: <a href="${escapeHtml(entry.commit_url)}" target="_blank" rel="noopener noreferrer"><code>${escapeHtml(shortSha)}</code></a></div>
      <div class="muted">Date: ${escapeHtml(entry.date)}</div>
      <div class="muted">${escapeHtml(entry.commit_message)}</div>
    </div>`;
}

export function generateIndexHtml(entries) {
  const cards = entries.length > 0 ? entries.map(renderCard).join('\n') : '<p class="muted">No deployments yet.</p>';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>map-viewer-component demos</title>
    <style>
      body { font: 16px/1.45 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Arial, sans-serif; margin: 2rem; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
      .card { border: 1px solid #ddd; border-radius: 10px; padding: 1rem; }
      .muted { color: #555; font-size: .92rem; }
      code { background: #f6f8fa; padding: .15rem .35rem; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>map-viewer-component demos</h1>
    <div class="grid">${cards}
    </div>
  </body>
</html>
`;
}

function main() {
  const siteDir = process.argv[2];
  if (!siteDir) {
    console.error('usage: node generate-pages-index.mjs <siteDir>');
    process.exit(1);
  }

  const entries = listEntries(siteDir);
  const html = generateIndexHtml(entries);
  writeFileSync(join(siteDir, 'index.html'), html);
  console.log(`wrote ${join(siteDir, 'index.html')} with ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
