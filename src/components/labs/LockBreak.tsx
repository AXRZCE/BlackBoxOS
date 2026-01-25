'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useThemeStore } from '@/lib/theme-store';
import { track } from '@/lib/telemetry';

const DECRYPT_DURATION = 3000; // 3 seconds to decrypt
const MESSAGES = [
  'ACCESS GRANTED',
  'HEIST MODE UNLOCKED',
  'WELCOME TO THE VAULT',
];

export function LockBreak() {
  const [progress, setProgress] = useState(0);
  const [decrypted, setDecrypted] = useState(false);
  const [message, setMessage] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const trackedRef = useRef(false);

  const heistUnlocked = useThemeStore((s) => s.heistUnlocked);
  const unlockHeist = useThemeStore((s) => s.unlockHeist);

  // Track usage once
  useEffect(() => {
    if (!trackedRef.current) {
      track({ type: 'lab_used', name: 'lock_break' });
      trackedRef.current = true;
    }
  }, []);

  const startDecrypt = useCallback(() => {
    if (decrypted) return;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (DECRYPT_DURATION / 50));
        if (next >= 100) {
          clearInterval(intervalRef.current!);
          setDecrypted(true);
          // Pick a random message, or unlock heist if not already
          if (!heistUnlocked) {
            unlockHeist();
            setMessage('HEIST MODE UNLOCKED');
            track({ type: 'heist_unlocked', source: 'lock_break' });
          } else {
            setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
          }
          return 100;
        }
        return next;
      });
    }, 50);
  }, [decrypted, heistUnlocked, unlockHeist]);

  const stopDecrypt = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!decrypted) {
      setProgress(0);
    }
  }, [decrypted]);

  const reset = () => {
    setProgress(0);
    setDecrypted(false);
    setMessage('');
  };

  // Keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      startDecrypt();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      stopDecrypt();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {!decrypted ? (
        <>
          {/* Lock icon */}
          <div className="relative mb-6">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              className="text-foreground/30"
            >
              <rect
                x="5"
                y="11"
                width="14"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 11V7a4 4 0 118 0v4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {/* Progress ring */}
            <svg
              className="absolute inset-0 -rotate-90"
              width="64"
              height="64"
              viewBox="0 0 64 64"
            >
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-border/30"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${(progress / 100) * 176} 176`}
                className="text-accent transition-all duration-100"
              />
            </svg>
          </div>

          {/* Progress text */}
          <div className="text-micro text-foreground/50 mb-4">
            {progress > 0 ? `DECRYPTING... ${Math.round(progress)}%` : 'HOLD TO DECRYPT'}
          </div>

          {/* Hold button */}
          <button
            onMouseDown={startDecrypt}
            onMouseUp={stopDecrypt}
            onMouseLeave={stopDecrypt}
            onTouchStart={startDecrypt}
            onTouchEnd={stopDecrypt}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            className={`
              px-6 py-3 border rounded-sm text-label transition-all
              focus:outline-none focus:ring-2 focus:ring-accent/50
              ${progress > 0
                ? 'border-accent bg-accent/20 text-accent'
                : 'border-border/50 text-foreground/60 hover:border-accent/50'
              }
            `}
            aria-label="Hold to decrypt the lock"
          >
            {progress > 0 ? 'DECRYPTING...' : 'HOLD TO DECRYPT'}
          </button>
        </>
      ) : (
        <>
          {/* Success state */}
          <div className="text-center">
            <div className="text-4xl mb-4">🔓</div>
            <div className="text-heading text-accent mb-2">{message}</div>
            <button
              onClick={reset}
              className="text-micro text-foreground/40 hover:text-foreground/60 underline"
            >
              RESET
            </button>
          </div>
        </>
      )}
    </div>
  );
}

