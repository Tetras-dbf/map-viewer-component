#!/usr/bin/env node
// Writes a meta.json describing the currently checked-out commit, for the
// GitHub Pages demo deploy workflow's on-page banner and landing page.
// LABEL/BRANCH/PR_URL come from the environment (set by the workflow);
// commit/date/commit message come from `git log`/`git rev-parse` on
// whatever commit is currently checked out.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

export function buildMeta({ label, branch, prUrl, repository, commit, date, commitMessage }) {
  if (!label) {
    throw new Error('label is required');
  }

  return {
    label,
    branch,
    commit,
    commit_url: `https://github.com/${repository}/commit/${commit}`,
    commit_message: commitMessage,
    date,
    pr_url: prUrl || null,
  };
}

function main() {
  const outPath = process.argv[2];
  if (!outPath) {
    console.error('usage: node write-deploy-meta.mjs <outPath>');
    process.exit(1);
  }

  const meta = buildMeta({
    label: process.env.LABEL,
    branch: process.env.BRANCH || git('rev-parse', '--abbrev-ref', 'HEAD'),
    prUrl: process.env.PR_URL,
    repository: process.env.GITHUB_REPOSITORY,
    commit: git('rev-parse', 'HEAD'),
    date: git('log', '-1', '--date=iso-strict', '--format=%cd'),
    commitMessage: git('log', '-1', '--format=%s'),
  });

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(meta, null, 2));
  console.log(`wrote ${outPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
