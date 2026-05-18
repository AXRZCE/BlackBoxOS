'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PalantirCardProps {
  index: number;
  title: string;
  subtitle: string;
  description: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  icon?: 'neural' | 'data' | 'code' | 'cloud' | 'chart' | 'lock';
}

// Different icons for each project (like Palantir's product symbols)
const ICONS: Record<string, React.ReactNode> = {
  neural: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <circle cx="32" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="40" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="48" cy="40" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="48" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 20v8M20 38l8-6M44 38l-8-6M32 44v-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  data: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <rect x="12" y="28" width="8" height="24" stroke="currentColor" strokeWidth="1.5" />
      <rect x="28" y="16" width="8" height="36" stroke="currentColor" strokeWidth="1.5" />
      <rect x="44" y="22" width="8" height="30" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <path d="M24 20L12 32l12 12M40 20l12 12-12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 16L28 48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <path d="M48 40H16a8 8 0 01-8-8 8 8 0 018-8h1a12 12 0 0123.8-2A10 10 0 0156 32a10 10 0 01-8 8z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <path d="M12 48L24 32l12 8 16-24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="32" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="36" cy="40" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="52" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <rect x="16" y="28" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 28V20a8 8 0 1116 0v8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="40" r="3" fill="currentColor" />
    </svg>
  ),
};

// Map index to icon type
const ICON_ORDER: Array<keyof typeof ICONS> = ['neural', 'data', 'code', 'cloud', 'chart', 'lock'];

/**
 * Palantir-inspired product card with hover animations.
 * Features:
 * - Shows icon when not hovered, image when hovered (like Palantir)
 * - Large title that shifts on hover
 * - Index number (/0.1 style)
 * - Background color change on hover
 */
export function PalantirCard({
  index,
  title,
  subtitle,
  description,
  href,
  imageSrc,
  imageAlt = 'Project preview',
  icon,
}: PalantirCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format index as /0.1, /0.2, etc.
  const formattedIndex = `/${(index / 10).toFixed(1)}`;

  // Get icon based on prop or index
  const iconType = icon || ICON_ORDER[(index - 1) % ICON_ORDER.length];
  const IconSvg = ICONS[iconType];

  const cardClassName = `group block py-16 md:py-24 border-b border-border/30 relative transition-all duration-500 ${
    isHovered
      ? 'bg-[#f5f5f5] dark:bg-[#1a1a1a]'
      : 'bg-transparent'
  }`;

  const cardContent = (
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center">
        {/* Left column: Description + Index */}
        <div className="md:col-span-3 space-y-4">
          {/* Subtitle */}
          <p
            className={`text-sm font-medium leading-relaxed transition-colors duration-300 ${
              isHovered
                ? 'text-[#1d2433] dark:text-white'
                : 'text-[#1d2433]/70 dark:text-white/70'
            }`}
          >
            {subtitle}
          </p>

          {/* Description */}
          <p className={`text-sm leading-relaxed hidden md:block transition-colors duration-300 ${
            isHovered
              ? 'text-[#1d2433]/80 dark:text-white/80'
              : 'text-[#1d2433]/50 dark:text-white/50'
          }`}>
            {description}
          </p>

          {/* Index number */}
          <p className={`font-mono text-sm transition-colors duration-300 ${
            isHovered
              ? 'text-[#1d2433]/60 dark:text-white/60'
              : 'text-[#1d2433]/40 dark:text-white/40'
          }`}>{formattedIndex}</p>
        </div>

        {/* Center column: Icon (default) / Image (on hover) */}
        <div className="md:col-span-4 relative h-48 md:h-56">
          {/* Icon - visible when NOT hovered */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isHovered ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 text-[#1d2433]/15 dark:text-white/15">
              {IconSvg}
            </div>
          </div>

          {/* Image - visible when hovered */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
              isHovered
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
          >
            <div
              className={`relative w-full h-full border overflow-hidden transition-all duration-500 ${
                isHovered
                  ? 'shadow-2xl shadow-black/20 dark:shadow-black/40 border-[#1d2433]/20 dark:border-white/20'
                  : 'border-transparent'
              }`}
            >
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#f0f0f0] dark:bg-zinc-900">
                  <div className="w-16 h-16 border border-[#1d2433]/20 dark:border-zinc-700 relative">
                    <div className="absolute inset-0 border-l border-t border-[#1d2433]/10 dark:border-zinc-600 translate-x-2 translate-y-2" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Large title */}
        <div className="md:col-span-5 relative">
          <h3
            className={`text-5xl md:text-7xl lg:text-8xl font-sans font-black tracking-tight leading-[0.9] transition-all duration-500 ease-out text-[#1d2433] dark:text-white ${
              isHovered ? 'translate-x-4' : ''
            }`}
          >
            {title}
          </h3>

          {/* Arrow indicator on hover - only show if href exists */}
          {href && (
            <div
              className={`mt-6 transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}
            >
              <span className="text-[#1d2433]/60 dark:text-white/60 text-lg">→ View</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // If href is provided, wrap in Link; otherwise use a div
  if (href) {
    return (
      <Link
        href={href}
        className={cardClassName}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      className={cardClassName}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cardContent}
    </div>
  );
}

