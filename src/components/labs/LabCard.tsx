'use client';

import { ReactNode } from 'react';

interface LabCardProps {
  title: string;
  description: string;
  disabled?: boolean;
  disabledReason?: string;
  children: ReactNode;
}

export function LabCard({
  title,
  description,
  disabled = false,
  disabledReason,
  children,
}: LabCardProps) {
  return (
    <div
      className={`
        relative border border-border/50 bg-card/50 backdrop-blur
        rounded-sm overflow-hidden
        ${disabled ? 'opacity-60' : ''}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-heading text-foreground">{title}</h3>
          {disabled && disabledReason && (
            <span className="text-micro text-destructive/80 px-2 py-0.5 border border-destructive/30 rounded-sm">
              {disabledReason}
            </span>
          )}
        </div>
        <p className="text-body text-foreground/60">{description}</p>
      </div>

      {/* Content area */}
      <div className="relative h-64 bg-background/50">
        {disabled ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-label text-foreground/30">DISABLED</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

