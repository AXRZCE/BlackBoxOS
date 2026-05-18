'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { VaultScrollShell } from '@/components/shell/VaultScrollShell';
import { VaultDeepLink } from '@/components/shell/VaultDeepLink';
import { VaultKeyboard } from '@/components/shell/VaultKeyboard';
import { CommandPalette } from '@/components/shell/CommandPalette';
import { MobileProjectList } from '@/components/shell/MobileProjectList';
import { MobileListTrigger } from '@/components/shell/MobileListTrigger';
import { Reticle } from '@/components/shell/Reticle';
import { MissionTracker } from '@/components/shell/MissionTracker';
import { VaultGuide } from '@/components/shell/VaultGuide';

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

      {/* Guided UI overlay - navigation hints */}
      <VaultGuide />

      {/* Back navigation - fixed position */}
      <Link
        href="/war-room"
        className="fixed top-14 left-4 z-50 inline-flex items-center gap-2 px-4 py-2 text-sm font-mono uppercase tracking-widest bg-[#0b1220]/85 border border-cyan-300/50 text-white hover:bg-cyan-400/20 hover:border-cyan-200 transition-colors backdrop-blur-md"
      >
        <span>←</span>
        <span>Back</span>
      </Link>

      <div className="h-screen w-full relative">
        <Suspense fallback={
          <div className="h-full w-full flex items-center justify-center bg-white dark:bg-black">
            <div className="text-[#1d2433]/50 dark:text-white/50 font-mono text-sm animate-pulse">
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

