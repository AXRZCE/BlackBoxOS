'use client';

import { useEffect } from 'react';
import { markChecklistComplete } from './MissionChecklist';

// Storage key for last viewed project
const LAST_PROJECT_KEY = 'blackbox-last-project';

interface MissionTrackerProps {
  event: 'visited_war_room' | 'entered_vault' | 'opened_project' | 'viewed_proof' | 'clicked_contact';
  projectId?: string;
}

/**
 * Client component that tracks mission checklist events on mount.
 * Include this in pages to auto-mark checklist items as complete.
 */
export function MissionTracker({ event, projectId }: MissionTrackerProps) {
  useEffect(() => {
    // Mark the checklist item as complete
    markChecklistComplete(event);

    // If opening a project, also save as last project
    if (event === 'opened_project' && projectId) {
      localStorage.setItem(LAST_PROJECT_KEY, projectId);
    }
  }, [event, projectId]);

  return null;
}

/**
 * Get the last viewed project ID from localStorage
 */
export function getLastProjectId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_PROJECT_KEY);
}

/**
 * Clear the last viewed project ID
 */
export function clearLastProjectId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LAST_PROJECT_KEY);
}

