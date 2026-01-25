/**
 * Device capability detection for quality presets
 * 
 * Determines optimal rendering quality based on:
 * - Device type (mobile/desktop)
 * - Reduced motion preference
 * - Device memory (if available)
 * - Runtime FPS monitoring
 */

export type QualityPreset = 'high' | 'medium' | 'low';

export interface DeviceCapabilities {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  deviceMemory: number | null;
  hardwareConcurrency: number;
  isLowEnd: boolean;
}

/**
 * Detect device capabilities (client-side only)
 */
export function detectCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    // SSR fallback - assume high-end
    return {
      isMobile: false,
      prefersReducedMotion: false,
      deviceMemory: null,
      hardwareConcurrency: 8,
      isLowEnd: false,
    };
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.matchMedia('(max-width: 768px)').matches;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Navigator.deviceMemory is not available in all browsers
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null;

  const hardwareConcurrency = navigator.hardwareConcurrency || 4;

  // Low-end detection heuristics
  const isLowEnd = 
    isMobile ||
    prefersReducedMotion ||
    (deviceMemory !== null && deviceMemory <= 4) ||
    hardwareConcurrency <= 2;

  return {
    isMobile,
    prefersReducedMotion,
    deviceMemory,
    hardwareConcurrency,
    isLowEnd,
  };
}

/**
 * Determine quality preset based on capabilities
 */
export function getQualityPreset(capabilities: DeviceCapabilities): QualityPreset {
  if (capabilities.prefersReducedMotion) {
    return 'low';
  }

  if (capabilities.isMobile) {
    // Mobile devices get medium by default, low if very constrained
    if (capabilities.deviceMemory !== null && capabilities.deviceMemory <= 2) {
      return 'low';
    }
    return 'medium';
  }

  if (capabilities.isLowEnd) {
    return 'medium';
  }

  return 'high';
}

/**
 * Quality preset configurations
 */
export const QUALITY_CONFIGS = {
  high: {
    dpr: [1, 2] as [number, number],
    postprocessing: true,
    shadowMapSize: 2048,
    maxCapsules: 10,
    lightCount: 3,
    environmentPreset: 'night' as const,
    bloomIntensity: 0.3,
    vignetteIntensity: 0.5,
  },
  medium: {
    dpr: [1, 1.5] as [number, number],
    postprocessing: true,
    shadowMapSize: 1024,
    maxCapsules: 6,
    lightCount: 2,
    environmentPreset: 'night' as const,
    bloomIntensity: 0.2,
    vignetteIntensity: 0.3,
  },
  low: {
    dpr: [1, 1] as [number, number],
    postprocessing: false,
    shadowMapSize: 512,
    maxCapsules: 4,
    lightCount: 1,
    environmentPreset: null,
    bloomIntensity: 0,
    vignetteIntensity: 0,
  },
} as const;

export type QualityConfig = typeof QUALITY_CONFIGS[QualityPreset];

/**
 * FPS-based quality downgrade trigger
 * Returns true if FPS has been below threshold for duration
 */
export class FPSMonitor {
  private samples: number[] = [];
  private lowFpsStart: number | null = null;
  
  readonly threshold = 45;
  readonly downgradeDuration = 2000; // 2 seconds
  
  addSample(fps: number): boolean {
    this.samples.push(fps);
    if (this.samples.length > 60) {
      this.samples.shift();
    }
    
    const avgFps = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    
    if (avgFps < this.threshold) {
      if (this.lowFpsStart === null) {
        this.lowFpsStart = Date.now();
      } else if (Date.now() - this.lowFpsStart > this.downgradeDuration) {
        return true; // Trigger downgrade
      }
    } else {
      this.lowFpsStart = null;
    }
    
    return false;
  }
  
  reset(): void {
    this.samples = [];
    this.lowFpsStart = null;
  }
}

