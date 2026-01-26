'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

// ============================================================================
// External store for mount state (avoids setState in useEffect)
// ============================================================================
const mountListeners = new Set<() => void>();
let isMountedState = false;

function getMountSnapshot(): boolean {
  return isMountedState;
}

function getMountServerSnapshot(): boolean {
  return false; // Always false on server
}

function subscribeMount(callback: () => void): () => void {
  mountListeners.add(callback);
  // Trigger mount state change after hydration
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

// ============================================================================
// External store for cursor state
// ============================================================================
const cursorListeners = new Set<() => void>();
let cursorState = {
  position: { x: -100, y: -100 },
  isVisible: false,
  isTouchDevice: false,
  initialized: false,
};

function getCursorSnapshot() {
  return cursorState;
}

const CURSOR_SERVER_SNAPSHOT = {
  position: { x: -100, y: -100 },
  isVisible: false,
  isTouchDevice: false,
  initialized: false,
};

function getCursorServerSnapshot() {
  return CURSOR_SERVER_SNAPSHOT;
}

function subscribeCursor(callback: () => void) {
  cursorListeners.add(callback);
  return () => cursorListeners.delete(callback);
}

function updateCursor(updates: Partial<typeof cursorState>) {
  cursorState = { ...cursorState, ...updates };
  cursorListeners.forEach((l) => l());
}

/**
 * Full-screen crosshair cursor with axis lines that span the viewport.
 * The native cursor is hidden and replaced with this custom crosshair.
 *
 * This component only renders on the client to avoid hydration mismatches.
 */
export function CrosshairCursor() {
  const isMounted = useSyncExternalStore(subscribeMount, getMountSnapshot, getMountServerSnapshot);
  const cursor = useSyncExternalStore(subscribeCursor, getCursorSnapshot, getCursorServerSnapshot);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Initialize touch device detection and cursor style
  useEffect(() => {
    if (!isMounted || cursor.initialized) return;

    // Check for touch device
    const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    updateCursor({ initialized: true, isTouchDevice: touchDevice });

    if (touchDevice) return;

    // Inject global cursor style
    const style = document.createElement('style');
    style.textContent = '* { cursor: none !important; }';
    document.head.appendChild(style);
    styleRef.current = style;

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [isMounted, cursor.initialized]);

  // Mouse tracking effect
  useEffect(() => {
    if (!isMounted || cursor.isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateCursor({ position: { x: e.clientX, y: e.clientY }, isVisible: true });
    };

    const handleMouseLeave = () => {
      updateCursor({ isVisible: false });
    };

    const handleMouseEnter = () => {
      updateCursor({ isVisible: true });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMounted, cursor.isTouchDevice]);

  // Don't render anything on server or on touch devices
  if (!isMounted || cursor.isTouchDevice) {
    return null;
  }

  const { position, isVisible } = cursor;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Vertical line (full height) */}
      <div
        className={`absolute top-0 h-full w-px bg-zinc-400/40 transition-opacity duration-100 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: position.x,
          transform: 'translateX(-50%)',
        }}
      />

      {/* Horizontal line (full width) */}
      <div
        className={`absolute left-0 w-full h-px bg-zinc-400/40 transition-opacity duration-100 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          top: position.y,
          transform: 'translateY(-50%)',
        }}
      />

      {/* Center crosshair (small cross at intersection) */}
      <div
        className={`absolute transition-opacity duration-100 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Small center cross */}
        <svg width="20" height="20" viewBox="0 0 20 20" className="text-zinc-300">
          {/* Vertical short line */}
          <line
            x1="10"
            y1="4"
            x2="10"
            y2="16"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Horizontal short line */}
          <line
            x1="4"
            y1="10"
            x2="16"
            y2="10"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}

