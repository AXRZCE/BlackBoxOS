'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';

const LAST_PROJECT_KEY = 'blackbox-last-project';

// External store for last project ID
const listeners = new Set<() => void>();
let cachedLastProjectId: string | null = null;
let isInitialized = false;

function initializeFromStorage(): void {
  if (!isInitialized && typeof window !== 'undefined') {
    isInitialized = true;
    cachedLastProjectId = localStorage.getItem(LAST_PROJECT_KEY);
  }
}

function getSnapshot(): string | null {
  initializeFromStorage();
  return cachedLastProjectId;
}

function getServerSnapshot(): string | null {
  return null;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// Mounting state external store
const mountListeners = new Set<() => void>();
let isMountedState = false;

function getMountSnapshot(): boolean {
  return isMountedState;
}

function getMountServerSnapshot(): boolean {
  return false;
}

function subscribeMount(callback: () => void): () => void {
  mountListeners.add(callback);
  if (typeof window !== 'undefined' && !isMountedState) {
    queueMicrotask(() => {
      if (!isMountedState) {
        isMountedState = true;
        mountListeners.forEach((l) => l());
      }
    });
  }
  return () => mountListeners.delete(callback);
}

export function ContinueButton() {
  const lastProjectId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isMounted = useSyncExternalStore(subscribeMount, getMountSnapshot, getMountServerSnapshot);

  // Don't render on server or first client render
  if (!isMounted) return null;

  // Find the project
  const lastProject = lastProjectId ? projects.find((p) => p.id === lastProjectId) : null;

  if (!lastProject) return null;

  return (
    <div className="px-6 md:px-12 py-4 border-b border-accent/30 bg-accent/5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-micro uppercase tracking-wider text-foreground/60 font-mono">
            Continue where you left off
          </span>
        </div>
        <Link
          href={`/projects/${lastProject.id}`}
          className="text-sm font-medium text-accent hover:underline transition-colors"
        >
          Continue: {lastProject.title} →
        </Link>
      </div>
    </div>
  );
}

