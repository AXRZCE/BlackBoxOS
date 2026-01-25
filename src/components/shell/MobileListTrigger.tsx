'use client';

import { useVaultStore } from '@/lib/store';
import { List } from 'lucide-react';

/**
 * Floating action button to open mobile project list
 * Only visible on small screens (mobile)
 */
export function MobileListTrigger() {
  const setMobileListOpen = useVaultStore((state) => state.setMobileListOpen);
  const qualityPreset = useVaultStore((state) => state.qualityPreset);

  // Show on mobile (md breakpoint hides it)
  return (
    <button
      onClick={() => setMobileListOpen(true)}
      className="md:hidden fixed bottom-20 right-4 z-40 
                 w-14 h-14 rounded-full 
                 bg-zinc-900 border border-zinc-700 
                 flex items-center justify-center
                 shadow-lg shadow-black/50
                 transition-transform hover:scale-105 active:scale-95"
      aria-label="Open project list"
    >
      <List className="w-6 h-6 text-blue-400" />
      {/* Quality indicator dot */}
      <span
        className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
          qualityPreset === 'high'
            ? 'bg-green-400'
            : qualityPreset === 'medium'
            ? 'bg-yellow-400'
            : 'bg-red-400'
        }`}
      />
    </button>
  );
}

