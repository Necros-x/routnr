'use client';

import React, { useEffect, useState } from 'react';
import { Save, UserRound, X } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROFILE_STORAGE_KEY = 'routnr_profile_v1';

interface LocalProfile {
  displayName: string;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) {
        const profile = JSON.parse(raw) as LocalProfile;
        setDisplayName(profile.displayName || '');
      }
    } catch {
      setDisplayName('');
    }

    setSaved(false);

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

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();

    const profile: LocalProfile = {
      displayName: displayName.trim(),
    };

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setDisplayName(profile.displayName);
    setSaved(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/15 p-0 backdrop-blur-[5px] sm:items-center sm:p-5"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile"
        onMouseDown={(event) => event.stopPropagation()}
        className="glass-float backdrop-blur-[2px] w-full rounded-t-[28px] p-4 sm:max-w-md sm:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] bg-white/55">
              <UserRound className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                Account
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Profile</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-white/45 text-[var(--text-secondary)] hover:bg-white/65 hover:text-[var(--text-primary)]"
            aria-label="Close profile"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={saveProfile} className="mt-5">
          <div className="rounded-[12px] bg-white/45 p-4">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
              Display name
            </label>
            <input
              value={displayName}
              onChange={(event) => {
                setDisplayName(event.target.value);
                setSaved(false);
              }}
              placeholder="Your name"
              className="mt-2 h-11 w-full rounded-[10px] border border-[var(--border-subtle)] bg-white/65 px-3.5 text-sm outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)]"
            />

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[10px] bg-white/55 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                  Discipline
                </p>
                <p className="mt-1.5 text-xs font-semibold">Men’s Artistic</p>
              </div>
              <div className="rounded-[10px] bg-white/55 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                  Code
                </p>
                <p className="mt-1.5 text-xs font-semibold">2025–2028</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[22px] bg-[var(--accent)] px-4 text-xs font-semibold text-white"
          >
            <Save className="h-4 w-4" />
            {saved ? 'Saved' : 'Save profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
