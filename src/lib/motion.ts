/**
 * BLACKBOX OS Motion + Performance Guards
 * 
 * Centralized utilities for respecting user preferences and device capabilities.
 */

import type { QualityPreset } from './device';

/**
 * Check if user prefers reduced motion (client-safe)
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Subscribe to reduced motion preference changes
 */
export function subscribeReducedMotion(callback: (reduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}

/**
 * Check if animations should run based on quality preset
 * Returns false for LOW preset
 */
export function shouldAnimate(qualityPreset: QualityPreset): boolean {
  return qualityPreset !== 'low';
}

/**
 * Check if heavy effects (glitch, trails, HUD) should run
 * Returns false for LOW preset OR reduced motion preference
 */
export function shouldRunFx(qualityPreset: QualityPreset, reducedMotion?: boolean): boolean {
  if (qualityPreset === 'low') return false;
  if (reducedMotion === undefined) {
    return !prefersReducedMotion();
  }
  return !reducedMotion;
}

/**
 * Check if camera tweens should run
 * Returns false if reduced motion is preferred
 */
export function shouldTween(reducedMotion?: boolean): boolean {
  if (reducedMotion === undefined) {
    return !prefersReducedMotion();
  }
  return !reducedMotion;
}

/**
 * Get animation duration based on preferences
 * Returns 0 for reduced motion, otherwise the provided duration
 */
export function getAnimationDuration(durationMs: number, reducedMotion?: boolean): number {
  const reduced = reducedMotion ?? prefersReducedMotion();
  return reduced ? 0 : durationMs;
}

/**
 * Get transition style based on preferences
 * Returns 'none' for reduced motion
 */
export function getTransitionStyle(
  property: string,
  durationMs: number,
  easing: string = 'ease-out',
  reducedMotion?: boolean
): string {
  const reduced = reducedMotion ?? prefersReducedMotion();
  if (reduced) return 'none';
  return `${property} ${durationMs}ms ${easing}`;
}

/**
 * Effect intensity multiplier based on quality preset
 * HIGH: 1.0, MEDIUM: 0.6, LOW: 0
 */
export function getEffectIntensity(qualityPreset: QualityPreset): number {
  switch (qualityPreset) {
    case 'high': return 1.0;
    case 'medium': return 0.6;
    case 'low': return 0;
  }
}

/**
 * Type animation speed based on quality preset
 * Returns characters per second
 * HIGH: 60, MEDIUM: 40, LOW: Infinity (instant)
 */
export function getTypeSpeed(qualityPreset: QualityPreset): number {
  switch (qualityPreset) {
    case 'high': return 60;
    case 'medium': return 40;
    case 'low': return Infinity;
  }
}

