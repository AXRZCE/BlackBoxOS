'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useThemeStore } from '@/lib/theme-store';
import { track } from '@/lib/telemetry';

const DECRYPT_DURATION = 3000;
const MESSAGES = [
  'ACCESS GRANTED',
  'HEIST MODE UNLOCKED',
  'WELCOME TO THE VAULT',
  'ENCRYPTION BYPASSED',
  'FIREWALL DISABLED',
];

// Generate random hex characters for the decryption effect
const generateHex = (length: number) => {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16).toUpperCase()
  ).join('');
};

export function LockBreak() {
  const [progress, setProgress] = useState(0);
  const [decrypted, setDecrypted] = useState(false);
  const [message, setMessage] = useState('');
  const [hexDisplay, setHexDisplay] = useState('0000 0000 0000');
  const [attempts, setAttempts] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hexIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const trackedRef = useRef(false);

  const heistUnlocked = useThemeStore((s) => s.heistUnlocked);
  const unlockHeist = useThemeStore((s) => s.unlockHeist);

  useEffect(() => {
    if (!trackedRef.current) {
      track({ type: 'lab_used', name: 'lock_break' });
      trackedRef.current = true;
    }
  }, []);

  const completeDecrypt = useCallback(() => {
    setDecrypted(true);
    setHexDisplay('FFFF FFFF FFFF');
    if (!heistUnlocked) {
      unlockHeist();
      setMessage('HEIST MODE UNLOCKED');
      track({ type: 'heist_unlocked', source: 'lock_break' });
    } else {
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    }
  }, [heistUnlocked, unlockHeist]);

  const startDecrypt = useCallback(() => {
    if (decrypted) return;

    // Start hex animation
    hexIntervalRef.current = setInterval(() => {
      setHexDisplay(`${generateHex(4)} ${generateHex(4)} ${generateHex(4)}`);
    }, 50);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (DECRYPT_DURATION / 50));
        if (next >= 100) {
          clearInterval(intervalRef.current!);
          clearInterval(hexIntervalRef.current!);
          setTimeout(completeDecrypt, 0);
          return 100;
        }
        return next;
      });
    }, 50);
  }, [decrypted, completeDecrypt]);

  const stopDecrypt = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (hexIntervalRef.current) {
      clearInterval(hexIntervalRef.current);
      hexIntervalRef.current = null;
    }
    if (!decrypted && progress > 0) {
      setProgress(0);
      setHexDisplay('0000 0000 0000');
      setAttempts(a => a + 1);
    }
  }, [decrypted, progress]);

  const reset = () => {
    setProgress(0);
    setDecrypted(false);
    setMessage('');
    setHexDisplay('0000 0000 0000');
  };

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

  const progressPercent = Math.round(progress);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#f5f5f5] to-[#ebebeb] dark:from-[#0a0a0a] dark:to-[#050505] relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '20px 20px',
        }}
      />

      {!decrypted ? (
        <div className="relative z-10 flex flex-col items-center">
          {/* Lock visualization */}
          <div className="relative w-28 h-28 mb-6">
            {/* Outer ring - progress */}
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#1d2433]/10 dark:text-white/10"
              />
              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-accent transition-all duration-100"
                style={{
                  filter: progress > 0 ? 'drop-shadow(0 0 6px oklch(var(--accent) / 0.5))' : 'none',
                }}
              />
            </svg>

            {/* Inner lock icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`transition-transform duration-300 ${progress > 0 ? 'scale-90' : 'scale-100'}`}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`transition-colors duration-300 ${progress > 50 ? 'text-accent' : 'text-[#1d2433]/40 dark:text-white/40'}`}
                >
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M8 11V7a4 4 0 118 0v4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className={`transition-all duration-500 origin-bottom ${progress > 70 ? 'opacity-50' : 'opacity-100'}`}
                  />
                  {/* Keyhole */}
                  <circle cx="12" cy="15" r="1.5" fill="currentColor" className={progress > 0 ? 'animate-pulse' : ''} />
                </svg>
              </div>
            </div>

            {/* Percentage display */}
            {progress > 0 && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent font-bold">
                {progressPercent}%
              </div>
            )}
          </div>

          {/* Hex display */}
          <div className={`font-mono text-xs tracking-[0.2em] mb-4 transition-colors ${progress > 0 ? 'text-accent' : 'text-[#1d2433]/30 dark:text-white/30'}`}>
            {hexDisplay}
          </div>

          {/* Status text */}
          <div className="text-[10px] font-mono text-[#1d2433]/50 dark:text-white/50 mb-5 h-4">
            {progress > 0 ? (
              <span className="text-accent animate-pulse">BYPASSING ENCRYPTION...</span>
            ) : (
              <span>HOLD TO INITIATE BREACH</span>
            )}
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
              relative px-8 py-3 text-[10px] font-mono uppercase tracking-widest transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent/50 rounded
              ${progress > 0
                ? 'bg-accent text-white shadow-lg shadow-accent/30'
                : 'bg-[#1d2433]/5 dark:bg-white/5 text-[#1d2433]/60 dark:text-white/60 hover:bg-[#1d2433]/10 dark:hover:bg-white/10'
              }
            `}
          >
            {progress > 0 ? '◉ BREACHING' : '○ HOLD TO BREACH'}
          </button>

          {/* Attempts counter */}
          {attempts > 0 && (
            <div className="mt-4 text-[9px] font-mono text-[#1d2433]/30 dark:text-white/30">
              FAILED ATTEMPTS: {attempts}
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 text-center">
          {/* Success animation */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-accent">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="text-lg font-mono font-bold text-accent mb-2 tracking-wider">
            {message}
          </div>
          <div className="text-[10px] font-mono text-[#1d2433]/40 dark:text-white/40 mb-6">
            ENCRYPTION: NEUTRALIZED
          </div>

          <button
            onClick={reset}
            className="text-[10px] font-mono text-[#1d2433]/40 dark:text-white/40 hover:text-accent transition-colors underline underline-offset-4"
          >
            RESET LOCK
          </button>
        </div>
      )}
    </div>
  );
}

