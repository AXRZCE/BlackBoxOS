'use client';

import { useCallback, useState } from 'react';
import { track } from '@/lib/telemetry';

interface ContactPanelProps {
  /** Variant: inline for war-room, compact for overlays */
  variant?: 'inline' | 'compact';
  /** Show email as primary CTA */
  showPrimaryCta?: boolean;
}

// Contact info - update these with your real details
const CONTACT = {
  email: 'hello@example.com',
  github: 'https://github.com/example',
  linkedin: 'https://linkedin.com/in/example',
  resume: '/resume.pdf',
};

export function ContactPanel({ variant = 'inline', showPrimaryCta = true }: ContactPanelProps) {
  const [copied, setCopied] = useState(false);

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
  }, []);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      track({ type: 'contact_click', channel: 'email' });
    } catch {
      // Fallback - open mailto
      window.location.href = `mailto:${CONTACT.email}`;
    }
  }, []);

  if (variant === 'compact') {
    return (
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
        <a
          href={CONTACT.resume}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleResumeClick}
          className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono"
        >
          Resume
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showPrimaryCta && (
        <a
          href={`mailto:${CONTACT.email}`}
          onClick={handleEmailClick}
          className="inline-block px-8 py-3 bg-accent text-background font-mono text-label uppercase tracking-wider hover:bg-accent/90 transition-colors"
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
        <a
          href={CONTACT.resume}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleResumeClick}
          className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono"
        >
          Resume PDF
        </a>
        <button
          onClick={handleCopyEmail}
          className="text-micro uppercase tracking-wider text-foreground/50 hover:text-accent transition-colors font-mono"
        >
          {copied ? '✓ Copied' : 'Copy Email'}
        </button>
      </div>
    </div>
  );
}

