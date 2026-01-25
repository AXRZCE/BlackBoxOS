'use client';

import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function initLenis(wrapper?: HTMLElement, content?: HTMLElement): Lenis {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Return a minimal Lenis instance with instant scrolling
    lenisInstance = new Lenis({
      wrapper,
      content,
      duration: 0,
      easing: (t) => t,
    });
  } else {
    lenisInstance = new Lenis({
      wrapper,
      content,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });
  }

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis(): void {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

