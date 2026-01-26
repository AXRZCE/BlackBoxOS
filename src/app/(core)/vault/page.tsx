'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { VaultScrollShell } from '@/components/shell/VaultScrollShell';
import { VaultDeepLink } from '@/components/shell/VaultDeepLink';
import { VaultKeyboard } from '@/components/shell/VaultKeyboard';
import { CommandPalette } from '@/components/shell/CommandPalette';
import { MobileProjectList } from '@/components/shell/MobileProjectList';
import { MobileListTrigger } from '@/components/shell/MobileListTrigger';
import { Reticle } from '@/components/shell/Reticle';
import { MissionTracker } from '@/components/shell/MissionTracker';

const VaultCanvas = dynamic(
  () => import('@/components/three/VaultCanvas'),
  { ssr: false }
);

export default function VaultPage() {
  return (
    <VaultScrollShell>
      {/* Track vault entry */}
      <MissionTracker event="entered_vault" />

      {/* Deep linking handler */}
      <Suspense fallback={null}>
        <VaultDeepLink />
      </Suspense>

      {/* Keyboard navigation handler */}
      <VaultKeyboard />

      {/* Command palette (/ to open) */}
      <CommandPalette />

      {/* Mobile project list sheet */}
      <MobileProjectList />

      {/* Reticle lock-on overlay (DOM, above canvas) */}
      <Reticle />

      <div className="h-screen w-full relative">
        <Suspense fallback={
          <div className="h-full w-full flex items-center justify-center bg-background">
            <div className="text-foreground/50 font-mono text-sm animate-pulse">
              Loading Vault...
            </div>
          </div>
        }>
          <VaultCanvas />
        </Suspense>

        {/* Mobile floating action button */}
        <MobileListTrigger />
      </div>
    </VaultScrollShell>
  );
}

