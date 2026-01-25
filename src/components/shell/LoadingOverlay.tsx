'use client';

interface LoadingOverlayProps {
  /** Whether to show the loading state */
  isLoading: boolean;
  /** Optional progress value (0-100) */
  progress?: number;
  /** Optional message to display */
  message?: string;
}

export function LoadingOverlay({
  isLoading,
  progress,
  message = 'LOADING ASSETS',
}: LoadingOverlayProps) {
  // Simple visibility based on isLoading prop
  // CSS transitions handle the fade effect
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Animated loader */}
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 border-2 border-border/50 rounded-full" />
          {/* Spinning segment */}
          <div className="absolute inset-0 border-2 border-transparent border-t-accent rounded-full animate-spin" />
          {/* Inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-micro text-foreground/60">{message}</p>
          
          {/* Progress bar (optional) */}
          {progress !== undefined && (
            <div className="w-48 h-1 bg-border/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

