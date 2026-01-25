'use client';

import { useVaultStore } from '@/lib/store';
import { LabCard } from '@/components/labs/LabCard';
import { ParticleField } from '@/components/labs/ParticleField';
import { ScanlineGlass } from '@/components/labs/ScanlineGlass';
import { LockBreak } from '@/components/labs/LockBreak';
import { track } from '@/lib/telemetry';
import { useEffect } from 'react';

export default function LabsPage() {
  const qualityPreset = useVaultStore((s) => s.qualityPreset);
  const isLowSpec = qualityPreset === 'low';

  useEffect(() => {
    track({ type: 'labs_open' });
  }, []);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <header className="mb-10">
        <h1 className="text-display text-foreground mb-2">LABS</h1>
        <p className="text-body text-foreground/60 max-w-xl">
          Experimental features and interactive demos. Some experiments may be
          disabled on low-spec devices for performance.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LabCard
          title="Signal Noise"
          description="Particle field reacting to cursor movement. Visualizes ambient data flow."
          disabled={isLowSpec}
          disabledReason="Disabled in LOW mode"
        >
          <ParticleField disabled={isLowSpec} />
        </LabCard>

        <LabCard
          title="Scanline Glass"
          description="Animated scanline overlay with adjustable intensity. Retro CRT aesthetic."
          disabled={false}
        >
          <ScanlineGlass />
        </LabCard>

        <LabCard
          title="Lock Break"
          description="Decrypt the lock to reveal a hidden message. Hold to progress."
          disabled={false}
        >
          <LockBreak />
        </LabCard>
      </div>

      <footer className="mt-16 pt-6 border-t border-border/30">
        <p className="text-micro text-foreground/40">
          BLACKBOX LABS · EXPERIMENTAL · USE AT YOUR OWN RISK
        </p>
      </footer>
    </div>
  );
}

