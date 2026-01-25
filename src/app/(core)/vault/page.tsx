'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { VaultScrollShell } from '@/components/shell/VaultScrollShell';
import { VaultDeepLink } from '@/components/shell/VaultDeepLink';
import { VaultKeyboard } from '@/components/shell/VaultKeyboard';
import { CommandPalette } from '@/components/shell/CommandPalette';

const VaultCanvas = dynamic(
  () => import('@/components/three/VaultCanvas'),
  { ssr: false }
);

export default function VaultPage() {
  return (
    <VaultScrollShell>
      {/* Deep linking handler */}
      <Suspense fallback={null}>
        <VaultDeepLink />
      </Suspense>

      {/* Keyboard navigation handler */}
      <VaultKeyboard />

      {/* Command palette (/ to open) */}
      <CommandPalette />

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
      </div>
    </VaultScrollShell>
  );
}

