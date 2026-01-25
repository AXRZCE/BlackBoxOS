'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

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

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < bootLogs.length) {
        setDisplayedLogs((prev) => [...prev, bootLogs[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
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
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-2xl font-mono text-sm">
        <div className="border border-border p-6 bg-background">
          <div className="space-y-1">
            {displayedLogs.map((log, i) => (
              <div key={i} className="text-foreground/90">
                <span className="text-accent mr-2">&gt;</span>
                {log}
              </div>
            ))}
            {isComplete && (
              <div className="animate-pulse text-accent mt-4">█</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

