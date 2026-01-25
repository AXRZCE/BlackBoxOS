'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVaultStore } from '@/lib/store';
import { projects } from '@/data/projects';

/**
 * Handles deep linking for vault projects via URL query params
 * - On mount: reads ?project=<id> and selects that project
 * - On selection change: updates URL without full reload
 */
export function VaultDeepLink() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedProjectId = useVaultStore((state) => state.selectedProjectId);
  const setSelectedProjectId = useVaultStore((state) => state.setSelectedProjectId);

  // On mount: read query param and select project
  useEffect(() => {
    const projectParam = searchParams.get('project');
    if (projectParam) {
      // Validate that the project exists
      const projectExists = projects.some(p => p.id === projectParam);
      if (projectExists) {
        setSelectedProjectId(projectParam);
      }
    }
  }, [searchParams, setSelectedProjectId]);

  // On selection change: update URL
  useEffect(() => {
    const currentParam = searchParams.get('project');
    
    if (selectedProjectId && selectedProjectId !== currentParam) {
      // Add project to URL
      const params = new URLSearchParams(searchParams.toString());
      params.set('project', selectedProjectId);
      router.replace(`/vault?${params.toString()}`, { scroll: false });
    } else if (!selectedProjectId && currentParam) {
      // Remove project from URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete('project');
      const newUrl = params.toString() ? `/vault?${params.toString()}` : '/vault';
      router.replace(newUrl, { scroll: false });
    }
  }, [selectedProjectId, searchParams, router]);

  return null;
}

