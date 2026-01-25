'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import { track } from '@/lib/telemetry';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href?: string;
  action?: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'identity',
    label: 'Who I am',
    description: 'Product-minded engineer focused on AI/ML and real-time systems',
  },
  {
    id: 'top-project',
    label: 'See top project',
    description: 'Neural Interface — 8ms latency, 95% accuracy',
    href: '/vault?project=project-1',
  },
  {
    id: 'case-study',
    label: 'Read a case study',
    description: 'Deep dive into technical decisions and outcomes',
    href: '/projects/project-1',
  },
  {
    id: 'contact',
    label: 'Get in touch',
    description: 'Email, LinkedIn, or grab my resume',
    action: 'scroll-to-contact',
  },
];

const STORAGE_KEY = 'blackbox-mission-checklist';

interface CheckedState {
  [key: string]: boolean;
}

// External store for localStorage persistence
const listeners = new Set<() => void>();
let cachedChecked: CheckedState = {};

function getSnapshot(): CheckedState {
  return cachedChecked;
}

const SERVER_SNAPSHOT: CheckedState = {};
function getServerSnapshot(): CheckedState {
  return SERVER_SNAPSHOT;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  // Load from localStorage on first subscription (client-side only)
  if (typeof window !== 'undefined' && Object.keys(cachedChecked).length === 0) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        cachedChecked = JSON.parse(stored);
      } catch {
        // Invalid JSON
      }
    }
  }
  return () => listeners.delete(callback);
}

function updateChecked(id: string, value: boolean): void {
  cachedChecked = { ...cachedChecked, [id]: value };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedChecked));
  }
  listeners.forEach((l) => l());
}

export function MissionChecklist() {
  const [isOpen, setIsOpen] = useState(true);
  const checked = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleCheck = useCallback((id: string) => {
    const newValue = !checked[id];
    updateChecked(id, newValue);
    track({ type: 'mission_checklist_item', item: id, checked: newValue });
  }, [checked]);

  const handleItemClick = useCallback((item: ChecklistItem) => {
    handleCheck(item.id);
    if (item.action === 'scroll-to-contact') {
      const contactSection = document.getElementById('contact-cta');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [handleCheck]);

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Don't render on server
  const isMounted = typeof window !== 'undefined';
  if (!isMounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 bg-zinc-900/95 border border-border/50 backdrop-blur-sm shadow-xl shadow-black/50">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-border/30 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-micro uppercase tracking-wider font-mono text-foreground/80">
            Mission Brief
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-micro font-mono text-accent">{progressPercent}%</span>
          <span className="text-foreground/40">{isOpen ? '−' : '+'}</span>
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="p-3 space-y-2">
          {CHECKLIST_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`group flex items-start gap-3 p-2 border border-transparent hover:border-border/30 hover:bg-zinc-800/30 transition-colors cursor-pointer ${
                checked[item.id] ? 'opacity-60' : ''
              }`}
              onClick={() => handleItemClick(item)}
            >
              {/* Checkbox */}
              <div
                className={`mt-0.5 w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${
                  checked[item.id]
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-border/50 group-hover:border-accent/50'
                }`}
              >
                {checked[item.id] && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                {item.href ? (
                  <a
                    href={item.href}
                    className={`text-sm font-medium block hover:text-accent transition-colors ${
                      checked[item.id] ? 'line-through text-foreground/50' : 'text-foreground/90'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={`text-sm font-medium block ${
                      checked[item.id] ? 'line-through text-foreground/50' : 'text-foreground/90'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
                <p className="text-micro text-foreground/50 mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

