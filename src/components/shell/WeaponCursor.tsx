'use client';

import { useEffect, useState, useRef } from 'react';
import { useModeStore } from '@/lib/mode-store';
import { useVaultStore } from '@/lib/store';
import { shouldRunFx } from '@/lib/motion';

type CursorState = 'idle' | 'hover' | 'lock';

/**
 * WeaponCursor - Military HUD cursor with 3 states
 * - Idle: dot + faint cross
 * - Hover: reticle + mild pulse
 * - Lock: brackets + "LOCK" microtext + tick animation
 */
export function WeaponCursor() {
  const mode = useModeStore((s) => s.mode);
  const qualityPreset = useVaultStore((s) => s.qualityPreset);
  const hoverId = useVaultStore((s) => s.hoverId);
  const selectedProjectId = useVaultStore((s) => s.selectedProjectId);
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<CursorState>('idle');
  const [shouldRender, setShouldRender] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const trailRef = useRef<{ x: number; y: number }[]>([]);

  // Check if we should render based on quality preferences
  useEffect(() => {
    setShouldRender(shouldRunFx(qualityPreset));
  }, [qualityPreset]);

  // Update cursor state based on hover/selection
  useEffect(() => {
    if (selectedProjectId && hoverId === selectedProjectId) {
      setCursorState('lock');
    } else if (hoverId) {
      setCursorState('hover');
    } else {
      setCursorState('idle');
    }
  }, [hoverId, selectedProjectId]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Update trail (only in overdrive)
      if (mode === 'overdrive' && qualityPreset !== 'low') {
        trailRef.current = [
          { x: e.clientX, y: e.clientY },
          ...trailRef.current.slice(0, 4),
        ];
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mode, qualityPreset]);

  // Don't render in LOW quality or if not visible
  if (!shouldRender || !isVisible) return null;

  const size = cursorState === 'lock' ? 32 : cursorState === 'hover' ? 24 : 16;
  const opacity = mode === 'overdrive' ? 0.8 : 0.4;

  return (
    <div 
      className="fixed pointer-events-none z-[300]"
      style={{
        left: position.x - size / 2,
        top: position.y - size / 2,
        width: size,
        height: size,
        transition: 'width 150ms, height 150ms, left 30ms, top 30ms',
      }}
    >
      {cursorState === 'idle' && <IdleCursor opacity={opacity} />}
      {cursorState === 'hover' && <HoverCursor opacity={opacity} />}
      {cursorState === 'lock' && <LockCursor opacity={opacity} />}
    </div>
  );
}

function IdleCursor({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 16 16" className="w-full h-full" style={{ opacity }}>
      {/* Center dot */}
      <circle cx="8" cy="8" r="2" fill="var(--accent)" />
      {/* Faint cross */}
      <line x1="8" y1="0" x2="8" y2="5" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
      <line x1="8" y1="11" x2="8" y2="16" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
      <line x1="0" y1="8" x2="5" y2="8" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
      <line x1="11" y1="8" x2="16" y2="8" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

function HoverCursor({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full animate-pulse" style={{ opacity, animationDuration: '1.5s' }}>
      {/* Reticle circle */}
      <circle cx="12" cy="12" r="8" fill="none" stroke="var(--accent)" strokeWidth="1" />
      {/* Center dot */}
      <circle cx="12" cy="12" r="2" fill="var(--accent)" />
      {/* Cross lines */}
      <line x1="12" y1="0" x2="12" y2="6" stroke="var(--accent)" strokeWidth="1" />
      <line x1="12" y1="18" x2="12" y2="24" stroke="var(--accent)" strokeWidth="1" />
      <line x1="0" y1="12" x2="6" y2="12" stroke="var(--accent)" strokeWidth="1" />
      <line x1="18" y1="12" x2="24" y2="12" stroke="var(--accent)" strokeWidth="1" />
    </svg>
  );
}

function LockCursor({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ opacity }}>
      {/* Corner brackets */}
      <path d="M2 10 L2 2 L10 2" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <path d="M22 2 L30 2 L30 10" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <path d="M30 22 L30 30 L22 30" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <path d="M10 30 L2 30 L2 22" fill="none" stroke="var(--accent)" strokeWidth="2" />
      {/* Center dot */}
      <circle cx="16" cy="16" r="3" fill="var(--accent)" />
      {/* LOCK text */}
      <text x="16" y="28" textAnchor="middle" fill="var(--accent)" fontSize="5" fontFamily="monospace">LOCK</text>
    </svg>
  );
}

