/**
 * BLACKBOX OS Telemetry
 * 
 * Lightweight analytics wrapper for tracking user interactions.
 * Events are logged to console in development and can be sent to 
 * an analytics service in production.
 */

// Event types for BLACKBOX OS
export type TelemetryEvent =
  | { type: 'boot_enter' }
  | { type: 'boot_complete'; duration_ms: number }
  | { type: 'vault_enter' }
  | { type: 'project_select'; project_id: string }
  | { type: 'project_open'; project_id: string }
  | { type: 'project_close'; project_id: string; view_duration_ms?: number }
  | { type: 'command_palette_open' }
  | { type: 'command_palette_close' }
  | { type: 'command_execute'; command: string }
  | { type: 'wireframe_toggle'; enabled: boolean }
  | { type: 'quality_preset_changed'; preset: 'high' | 'medium' | 'low'; auto: boolean }
  | { type: 'keyboard_nav'; action: 'next' | 'prev' | 'escape' }
  | { type: 'mobile_list_open' }
  | { type: 'mobile_list_close' }
  | { type: 'reticle_lock'; project_id: string }
  | { type: 'deep_link'; project_id: string }
  // Theme events
  | { type: 'theme_toggle'; theme: 'blackbox' | 'heist' }
  | { type: 'heist_unlocked'; source: 'command' | 'lock_break' }
  // Labs events
  | { type: 'labs_open' }
  | { type: 'lab_used'; name: string }
  // Mode events (M5)
  | { type: 'mode_change'; mode: 'stealth' | 'overdrive' }
  | { type: 'overdrive_unlocked'; source: 'command' | 'hero' }
  // Transition events (M5)
  | { type: 'target_lock'; project_id: string }
  | { type: 'casefile_open'; project_id: string }
  // M6: Recruiter conversion events
  | { type: 'war_room_enter' }
  | { type: 'mission_checklist_item'; item: string; checked: boolean }
  | { type: 'contact_click'; channel: 'email' | 'linkedin' | 'github' | 'resume' };

// Internal event queue for batching (optional future enhancement)
const eventQueue: TelemetryEvent[] = [];

// Track if telemetry is enabled
const isEnabled = () => {
  // Disable in development unless explicitly enabled
  if (typeof window === 'undefined') return false;
  if (process.env.NODE_ENV !== 'production') {
    return process.env.NEXT_PUBLIC_TELEMETRY_DEBUG === 'true';
  }
  return true;
};

/**
 * Track a telemetry event
 */
export function track(event: TelemetryEvent): void {
  // Always log in development for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Telemetry]', event.type, event);
  }

  if (!isEnabled()) return;

  // Add timestamp
  const enrichedEvent = {
    ...event,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.pathname : undefined,
  };

  eventQueue.push(event);

  // In production, you would send to your analytics service here
  // Examples:
  // - Vercel Analytics: window.va?.track(event.type, event)
  // - Mixpanel: mixpanel.track(event.type, event)
  // - PostHog: posthog.capture(event.type, event)
  // - Custom endpoint: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(enrichedEvent) })

  // For now, just log enriched event
  if (process.env.NODE_ENV === 'production') {
    console.debug('[Telemetry]', enrichedEvent);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string): void {
  if (path === '/boot') {
    track({ type: 'boot_enter' });
  } else if (path === '/vault') {
    track({ type: 'vault_enter' });
  }
}

/**
 * Create a timer for measuring durations
 */
export function createTimer(): () => number {
  const start = performance.now();
  return () => Math.round(performance.now() - start);
}

/**
 * Hook helper for tracking project view duration
 */
export function createProjectViewTracker(projectId: string) {
  const getElapsed = createTimer();
  
  return {
    complete: () => {
      track({
        type: 'project_close',
        project_id: projectId,
        view_duration_ms: getElapsed(),
      });
    },
  };
}

