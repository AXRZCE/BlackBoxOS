'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const VaultCanvas = dynamic(
  () => import('@/components/three/VaultCanvas'),
  { ssr: false }
);

export default function VaultPage() {
  return (
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
  );
}

