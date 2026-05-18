'use client';

import { useCallback, useState } from 'react';
import { track } from '@/lib/telemetry';
import { ResumeModal } from './ResumeModal';

interface ContactPanelProps {
  /** Variant: inline for war-room, compact for overlays */
  variant?: 'inline' | 'compact';
  /** Show email as primary CTA */
  showPrimaryCta?: boolean;
}

// Contact info
const CONTACT = {
  email: 'aksharaj.asp.15@gmail.com',
  github: 'https://github.com/AXRZCE',
  linkedin: 'https://www.linkedin.com/in/aksharajsinh',
};

export function ContactPanel({ variant = 'inline', showPrimaryCta = true }: ContactPanelProps) {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const handleEmailClick = useCallback(() => {
    track({ type: 'contact_click', channel: 'email' });
  }, []);

  const handleGitHubClick = useCallback(() => {
    track({ type: 'contact_click', channel: 'github' });
  }, []);

  const handleLinkedInClick = useCallback(() => {
    track({ type: 'contact_click', channel: 'linkedin' });
  }, []);

  const handleResumeClick = useCallback(() => {
    track({ type: 'contact_click', channel: 'resume' });
    setIsResumeOpen(true);
  }, []);

  if (variant === 'compact') {
    return (
      <>
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${CONTACT.email}`}
            onClick={handleEmailClick}
            className="text-micro uppercase tracking-wider text-accent hover:text-accent/80 transition-colors font-mono"
          >
            Email
          </a>
          <a
            href={CONTACT.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleGitHubClick}
            className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono"
          >
            GitHub
          </a>
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkedInClick}
            className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono"
          >
            LinkedIn
          </a>
          <button
            onClick={handleResumeClick}
            className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono"
          >
            Resume
          </button>
        </div>
        <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {showPrimaryCta && (
          <a
            href={`mailto:${CONTACT.email}`}
            onClick={handleEmailClick}
            className="inline-block px-8 py-3 bg-[#3b82f6] dark:bg-accent text-white dark:text-background font-mono text-label uppercase tracking-wider hover:bg-[#2563eb] dark:hover:bg-accent/90 transition-colors"
          >
            Get in Touch
          </a>
        )}

        <div className="flex flex-wrap justify-center gap-6">
          <a
            href={CONTACT.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleGitHubClick}
            className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono"
          >
            GitHub
          </a>
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkedInClick}
            className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono"
          >
            LinkedIn
          </a>
          <button
            onClick={handleResumeClick}
            className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono"
          >
            Resume
          </button>
        </div>
      </div>
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
}

