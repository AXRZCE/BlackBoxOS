'use client';

import { useEffect, useRef, useCallback } from 'react';
import { initLenis, destroyLenis, getLenis } from '@/lib/lenis';
import { useVaultStore } from '@/lib/store';
import { projects } from '@/data/projects';

interface VaultScrollShellProps {
  children: React.ReactNode;
}

export function VaultScrollShell({ children }: VaultScrollShellProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const setScrollProgress = useVaultStore((state) => state.setScrollProgress);

  // Calculate track height based on project count
  // Each project gets ~80vh of scroll space
  const trackHeight = projects.length * 80; // in vh units

  const handleScroll = useCallback(() => {
    const lenis = getLenis();
    if (!lenis) return;

    const progress = lenis.progress;
    setScrollProgress(progress);
  }, [setScrollProgress]);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const lenis = initLenis(wrapperRef.current, contentRef.current);

    // Animation frame loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Listen to scroll events
    lenis.on('scroll', handleScroll);

    return () => {
      destroyLenis();
    };
  }, [handleScroll]);

  return (
    <div 
      ref={wrapperRef}
      className="fixed inset-0 overflow-auto"
      style={{ height: '100vh' }}
    >
      <div ref={contentRef}>
        {/* Fixed canvas layer */}
        <div className="fixed inset-0 z-10 pointer-events-auto">
          {children}
        </div>
        
        {/* Scroll track - creates scrollable height */}
        <div 
          className="relative z-0 pointer-events-none"
          style={{ height: `${trackHeight}vh` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

