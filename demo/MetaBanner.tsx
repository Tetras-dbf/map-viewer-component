import { useEffect, useState } from 'react';

interface DeployMeta {
  label: string;
  branch: string;
  commit: string;
  commit_url: string;
  commit_message: string;
  date: string;
  pr_url: string | null;
}

export function MetaBanner() {
  const [meta, setMeta] = useState<DeployMeta | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('./meta.json')
      .then((response) => (response.ok ? (response.json() as Promise<DeployMeta>) : null))
      .then((data) => {
        if (!cancelled) {
          setMeta(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMeta(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!meta) {
    return null;
  }

  const shortSha = meta.commit.slice(0, 7);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#1a1a1a',
        color: '#fff',
        fontSize: '0.85rem',
        padding: '0.5rem 1rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        zIndex: 1000,
      }}
    >
      <strong>{meta.label}</strong>
      <span>Branch: {meta.branch}</span>
      <a href={meta.commit_url} target="_blank" rel="noopener noreferrer" style={{ color: '#8ab4f8' }}>
        {shortSha}
      </a>
      <span>{meta.date}</span>
      <span>{meta.commit_message}</span>
    </div>
  );
}
