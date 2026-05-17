'use client';

import { ReactNode, useState } from 'react';

interface LabCardProps {
  title: string;
  description: string;
  disabled?: boolean;
  disabledReason?: string;
  experimentId?: string;
  status?: 'active' | 'paused' | 'deprecated';
  children: ReactNode;
}

export function LabCard({
  title,
  description,
  disabled = false,
  disabledReason,
  experimentId,
  status = 'active',
  children,
}: LabCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    active: 'bg-green-500',
    paused: 'bg-yellow-500',
    deprecated: 'bg-red-500',
  };

  return (
    <div
      className={`
        relative group h-full flex flex-col
        bg-white dark:bg-[#0a0a0a]
        rounded-lg overflow-hidden
        transition-all duration-300 ease-out
        ${disabled ? 'opacity-50 grayscale' : ''}
        ${isHovered && !disabled ? 'shadow-xl shadow-black/5 dark:shadow-black/30 -translate-y-1' : 'shadow-md shadow-black/5 dark:shadow-black/20'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Accent border on hover */}
      <div className={`absolute inset-0 rounded-lg border-2 transition-colors duration-300 pointer-events-none ${isHovered && !disabled ? 'border-accent/50' : 'border-transparent'}`} />

      {/* Inner border */}
      <div className="absolute inset-0 rounded-lg border border-[#1d2433]/10 dark:border-white/10 pointer-events-none" />

      {/* Header */}
      <div className="p-4 relative flex-shrink-0">
        {/* Top row: ID and Status */}
        <div className="flex items-center justify-between mb-2">
          {experimentId && (
            <span className="text-[10px] font-mono tracking-widest text-[#1d2433]/40 dark:text-white/40">
              {experimentId}
            </span>
          )}
          <div className="flex items-center gap-2">
            {disabled && disabledReason && (
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded-full">
                {disabledReason}
              </span>
            )}
            <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]} ${status === 'active' && !disabled ? 'animate-pulse' : ''}`} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-[#1d2433] dark:text-white mb-1 tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[11px] text-[#1d2433]/60 dark:text-white/60 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Content area */}
      <div className="relative flex-1 min-h-0 mx-3 mb-3 rounded-md overflow-hidden bg-gradient-to-b from-[#f5f5f5] to-[#ebebeb] dark:from-[#111111] dark:to-[#0a0a0a]">
        {/* Subtle inner shadow */}
        <div className="absolute inset-0 shadow-inner pointer-events-none" />

        {disabled ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#1d2433]/20 dark:border-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#1d2433]/30 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <span className="text-[10px] font-mono text-[#1d2433]/40 dark:text-white/40 tracking-widest">
              EXPERIMENT PAUSED
            </span>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Interactive hint */}
      {!disabled && (
        <div className={`px-4 pb-3 transition-opacity duration-300 flex-shrink-0 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-[10px] font-mono text-accent tracking-widest">
            ↑ INTERACT WITH EXPERIMENT
          </p>
        </div>
      )}
    </div>
  );
}

