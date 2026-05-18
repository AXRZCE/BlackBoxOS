'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useVaultStore } from '@/lib/store';
import { LabCard } from '@/components/labs/LabCard';
import { track } from '@/lib/telemetry';
import { useEffect, useState } from 'react';

// Dynamic imports for 3D components (no SSR)
const GravitationalVortex = dynamic(() => import('@/components/labs/GravitationalVortex'), { ssr: false });
const MorphingBlob = dynamic(() => import('@/components/labs/MorphingBlob'), { ssr: false });
const NeuralNetwork = dynamic(() => import('@/components/labs/NeuralNetwork'), { ssr: false });

export default function LabsPage() {
  const qualityPreset = useVaultStore((s) => s.qualityPreset);
  const isLowSpec = qualityPreset === 'low';
  const [glitchText, setGlitchText] = useState('LABS');

  useEffect(() => {
    track({ type: 'labs_open' });
  }, []);

  // Glitch effect on title
  useEffect(() => {
    const chars = 'LABS';
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

    const glitch = () => {
      const shouldGlitch = Math.random() > 0.7;
      if (shouldGlitch) {
        let result = '';
        for (let i = 0; i < chars.length; i++) {
          result += Math.random() > 0.5 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : chars[i];
        }
        setGlitchText(result);
        setTimeout(() => setGlitchText('LABS'), 100);
      }
    };

    const interval = setInterval(glitch, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-white dark:bg-black p-4 md:p-6 relative overflow-hidden flex flex-col">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Back navigation */}
      <Link
        href="/war-room"
        className="relative inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#1d2433]/50 dark:text-white/50 hover:text-[#1d2433] dark:hover:text-white transition-colors mb-3 group flex-shrink-0"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>Exit Labs</span>
      </Link>

      <header className="mb-4 relative flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-light tracking-[0.2em] text-[#1d2433] dark:text-white mb-1 font-mono">
          {glitchText}
        </h1>
        <p className="text-xs text-[#1d2433]/60 dark:text-white/60 max-w-md leading-relaxed font-light">
          Interactive experiments and prototypes. Move your cursor, hold buttons,
          and adjust sliders. Everything here responds to your input.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 relative flex-1 min-h-0">
        <LabCard
          title="Gravitational Vortex"
          description="5,000 particles orbiting a singularity. Click and hold to attract them with gravitational force."
          disabled={isLowSpec}
          disabledReason="WebGL Required"
          experimentId="EXP-001"
          status="active"
        >
          <GravitationalVortex disabled={isLowSpec} />
        </LabCard>

        <LabCard
          title="Morphing Blob"
          description="Shader-powered procedural geometry. Move your mouse to deform the iridescent surface."
          disabled={isLowSpec}
          disabledReason="WebGL Required"
          experimentId="EXP-002"
          status="active"
        >
          <MorphingBlob disabled={isLowSpec} />
        </LabCard>

        <LabCard
          title="Neural Network"
          description="Interactive 3D neural network visualization. Click nodes to trigger activation propagation."
          disabled={isLowSpec}
          disabledReason="WebGL Required"
          experimentId="EXP-003"
          status="active"
        >
          <NeuralNetwork disabled={isLowSpec} />
        </LabCard>
      </div>

      <footer className="mt-2 pt-2 border-t border-[#1d2433]/5 dark:border-white/5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
          <p className="text-[10px] font-mono text-[#1d2433]/40 dark:text-white/40 tracking-widest uppercase">
            All systems operational
          </p>
        </div>
        <p className="text-[10px] font-mono text-[#1d2433]/30 dark:text-white/30 tracking-widest">
          v0.1.0-experimental
        </p>
      </footer>
    </div>
  );
}

