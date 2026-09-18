'use client';

import React, { useEffect } from 'react';
import {
  Download,
  HardDrive,
  MoonStar,
  Settings2,
  X,
} from 'lucide-react';
import { APP_CONFIG } from '../config/app';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDownloads: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  onOpenDownloads,
}: SettingsModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/15 p-0 backdrop-blur-[5px] sm:items-center sm:p-5"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onMouseDown={(event) => event.stopPropagation()}
        className="glass-float backdrop-blur-[2px] w-full rounded-t-[28px] p-4 sm:max-w-md sm:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] bg-white/55">
              <Settings2 className="h-4.5 w-4.5" />
            </span>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                Routnr
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                Settings
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-white/45 text-[var(--text-secondary)] hover:bg-white/65 hover:text-[var(--text-primary)]"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-2">
          <div className="rounded-[12px] bg-white/45 p-4">
            <div className="flex items-center gap-3">
              <MoonStar className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">Appearance</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">
                  Light
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[12px] bg-white/45 p-4">
            <div className="flex items-center gap-3">
              <HardDrive className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">App data</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">
                  Stored locally on this device
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDownloads();
            }}
            className="flex w-full items-center gap-3 rounded-[12px] bg-white/45 p-4 text-left transition-colors hover:bg-white/60"
          >
            <Download className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold">Offline & downloads</p>
              <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">
                Manage the offline app and Code figures
              </p>
            </div>
          </button>

          <div className="rounded-[12px] bg-white/45 p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Code cycle
            </p>
            <p className="mt-1.5 text-xs font-semibold">{APP_CONFIG.codeCycle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
