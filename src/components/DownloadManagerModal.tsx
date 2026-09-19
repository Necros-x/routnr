'use client';
import { POPUP_INITIAL_Y, POPUP_SPRING } from '../config/motion';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  HardDriveDownload,
  Trash2,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import {
  CODE_FIGURE_MANIFEST_PATH,
  MAG_CODE_PDF_URL,
  OFFLINE_CACHE_NAME,
  OFFLINE_STORAGE_KEY,
} from '../config/code';

interface DownloadManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FigureManifest {
  version: number;
  files: string[];
}

interface OfflinePackRecord {
  version: number;
  installedAt: string;
  resources: number;
  figures: number;
}

type Phase = 'idle' | 'downloading' | 'ready' | 'error';

export function DownloadManagerModal({
  isOpen,
  onClose,
}: DownloadManagerModalProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [record, setRecord] = useState<OfflinePackRecord | null>(null);
  const [figureCount, setFigureCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncOnlineState = () => setIsOnline(navigator.onLine);
    syncOnlineState();

    window.addEventListener('online', syncOnlineState);
    window.addEventListener('offline', syncOnlineState);

    return () => {
      window.removeEventListener('online', syncOnlineState);
      window.removeEventListener('offline', syncOnlineState);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as OfflinePackRecord;
        setRecord(parsed);
        setPhase('ready');
      } else {
        setRecord(null);
        setPhase('idle');
      }
    } catch {
      setRecord(null);
      setPhase('idle');
    }

    fetch(CODE_FIGURE_MANIFEST_PATH, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((manifest: FigureManifest | null) => {
        setFigureCount(Array.isArray(manifest?.files) ? manifest.files.length : 0);
      })
      .catch(() => setFigureCount(record?.figures ?? 0));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const loadManifest = async (): Promise<FigureManifest> => {
    try {
      const response = await fetch(CODE_FIGURE_MANIFEST_PATH, {
        cache: 'no-store',
      });

      if (!response.ok) return { version: 1, files: [] };

      const manifest = (await response.json()) as FigureManifest;
      return {
        version: manifest.version || 1,
        files: Array.isArray(manifest.files) ? manifest.files : [],
      };
    } catch {
      return { version: 1, files: [] };
    }
  };

  const downloadOfflinePack = async () => {
    if (
      typeof window === 'undefined' ||
      !('caches' in window) ||
      !('serviceWorker' in navigator)
    ) {
      setErrorMessage('Offline storage is not available in this browser.');
      setPhase('error');
      return;
    }

    if (!navigator.onLine) {
      setErrorMessage('Connect to the internet once to download the offline pack.');
      setPhase('error');
      return;
    }

    setPhase('downloading');
    setProgress(0);
    setErrorMessage('');

    try {
      await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;

      const manifest = await loadManifest();
      setFigureCount(manifest.files.length);

      const resourceUrls = new Set<string>();

      const addSameOrigin = (value: string) => {
        try {
          const url = new URL(value, window.location.origin);
          if (url.origin === window.location.origin) {
            resourceUrls.add(url.href);
          }
        } catch {
          // Ignore malformed resource URLs.
        }
      };

      addSameOrigin('/');
      addSameOrigin(window.location.pathname || '/');
      addSameOrigin('/sw.js');
      addSameOrigin(CODE_FIGURE_MANIFEST_PATH);

      performance.getEntriesByType('resource').forEach((entry) => {
        addSameOrigin(entry.name);
      });

      manifest.files.forEach((file) => {
        const normalized = file.startsWith('/') ? file : `/code-figures/${file}`;
        addSameOrigin(normalized);
      });

      const resources = Array.from(resourceUrls);
      const cache = await caches.open(OFFLINE_CACHE_NAME);
      let completed = 0;
      let cachedResources = 0;

      for (const url of resources) {
        try {
          const request = new Request(url, { cache: 'reload' });
          const response = await fetch(request);

          if (response.ok) {
            await cache.put(request, response.clone());
            cachedResources += 1;
          }
        } catch {
          // One optional asset failing should not block the rest of the pack.
        } finally {
          completed += 1;
          setProgress(Math.round((completed / Math.max(resources.length, 1)) * 100));
        }
      }

      const rootCached =
        (await cache.match(new URL('/', window.location.origin).href)) ||
        (await cache.match('/'));

      if (!rootCached) {
        throw new Error('The app shell could not be cached.');
      }

      const nextRecord: OfflinePackRecord = {
        version: manifest.version || 1,
        installedAt: new Date().toISOString(),
        resources: cachedResources,
        figures: manifest.files.length,
      };

      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(nextRecord));
      setRecord(nextRecord);
      setProgress(100);
      setPhase('ready');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'The offline pack could not be downloaded.',
      );
      setPhase('error');
    }
  };

  const removeOfflinePack = async () => {
    if (typeof window === 'undefined') return;

    try {
      await caches.delete(OFFLINE_CACHE_NAME);

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations
            .filter((registration) =>
              registration.active?.scriptURL.endsWith('/sw.js'),
            )
            .map((registration) => registration.unregister()),
        );
      }
    } finally {
      localStorage.removeItem(OFFLINE_STORAGE_KEY);
      setRecord(null);
      setProgress(0);
      setPhase('idle');
      setErrorMessage('');
    }
  };

  const installedLabel = record?.installedAt
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(record.installedAt))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/15 p-0 backdrop-blur-[5px] sm:items-center sm:p-5"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: POPUP_INITIAL_Y, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={POPUP_SPRING}
        role="dialog"
        aria-modal="true"
        aria-label="Download manager"
        onMouseDown={(event) => event.stopPropagation()}
        className="glass-float backdrop-blur-[2px] max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] p-4 sm:max-w-xl sm:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
              Offline
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
              Download manager
            </h2>
            <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
              Keep Routnr, the skill library, and installed Code figures available without a connection.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-white/45 text-[var(--text-secondary)] hover:bg-white/65 hover:text-[var(--text-primary)]"
            aria-label="Close download manager"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 rounded-[12px] bg-white/45 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/70">
                {record ? (
                  <CheckCircle2 className="h-4.5 w-4.5" />
                ) : (
                  <HardDriveDownload className="h-4.5 w-4.5" />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Routnr offline pack</p>
                <p className="mt-0.5 text-[11px] text-[var(--text-tertiary)]">
                  {record
                    ? `${record.resources} cached resources · ${record.figures} Code figures`
                    : `App + skills · ${figureCount} Code figures in this build`}
                </p>
              </div>
            </div>

            <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold text-[var(--text-tertiary)]">
              {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {phase === 'downloading' && (
            <div className="mt-4">
              <div className="h-1.5 overflow-hidden rounded-full bg-black/8">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] font-medium text-[var(--text-tertiary)]">
                Downloading {progress}%
              </p>
            </div>
          )}

          {phase === 'error' && (
            <p className="mt-4 rounded-[10px] bg-[#fff0f0] px-3 py-2 text-[11px] leading-5 text-[var(--danger)]">
              {errorMessage}
            </p>
          )}

          {installedLabel && phase === 'ready' && (
            <p className="mt-4 text-[10px] text-[var(--text-tertiary)]">
              Last downloaded {installedLabel}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={downloadOfflinePack}
              disabled={phase === 'downloading'}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[22px] bg-[var(--accent)] px-4 text-xs font-semibold text-white disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {record ? 'Refresh offline pack' : 'Download for offline'}
            </button>

            {record && (
              <button
                type="button"
                onClick={removeOfflinePack}
                disabled={phase === 'downloading'}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[22px] border border-[var(--border-medium)] bg-white/60 text-[var(--text-secondary)] hover:text-[var(--danger)] disabled:opacity-50"
                aria-label="Remove offline pack"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 rounded-[12px] bg-white/45 p-4">
          <p className="text-xs font-semibold">Official MAG Code of Points</p>
          <p className="mt-1 text-[11px] leading-5 text-[var(--text-tertiary)]">
            ROUTNR is being reconciled against the current 2025–2028 MAG Code, its appendix, and MAG technical updates. Entries remain marked provisional until individually verified.
          </p>
          <a
            href={MAG_CODE_PDF_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Open official Code PDF
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
