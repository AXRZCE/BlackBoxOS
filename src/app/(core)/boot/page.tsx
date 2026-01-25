'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { track, createTimer } from '@/lib/telemetry';

const bootLogs = [
  'BLACKBOX OS v1.0.0',
  'Initializing system...',
  'Loading neural interface...',
  'Calibrating vault coordinates...',
  'Syncing project manifests...',
  'System ready.',
  '',
  'Press [ENTER] to access vault...',
];

export default function BootPage() {
  const router = useRouter();
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const bootTimerRef = useRef<(() => number) | null>(null);

  // Track boot enter and start timer
  useEffect(() => {
    track({ type: 'boot_enter' });
    bootTimerRef.current = createTimer();
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < bootLogs.length) {
        setDisplayedLogs((prev) => [...prev, bootLogs[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        // Track boot completion
        if (bootTimerRef.current) {
          track({ type: 'boot_complete', duration_ms: bootTimerRef.current() });
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = useCallback(() => {
    if (isComplete) {
      router.push('/vault');
    }
  }, [isComplete, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnter]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 scanlines">
      <div className="w-full max-w-2xl">
        {/* Terminal window */}
        <div className="border border-border/50 bg-background/50 backdrop-blur">
          {/* Terminal header */}
          <div className="h-8 px-4 flex items-center gap-2 border-b border-border/30">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
            <span className="text-micro text-foreground/30 ml-2">BLACKBOX://BOOT</span>
          </div>

          {/* Terminal content */}
          <div className="p-6 font-mono text-sm space-tight">
            {displayedLogs.map((log, i) => (
              <div key={i} className="text-foreground/80 flex items-start gap-2">
                <span className="text-accent/70 select-none">▸</span>
                <span className={log === '' ? 'h-4' : ''}>{log}</span>
              </div>
            ))}
            {isComplete && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-accent animate-pulse">█</span>
                <span className="text-micro text-foreground/40">AWAITING INPUT</span>
              </div>
            )}
          </div>
        </div>

        {/* Hint */}
        {isComplete && (
          <div className="mt-4 text-center">
            <span className="text-micro text-foreground/30">
              PRESS [ENTER] TO CONTINUE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

