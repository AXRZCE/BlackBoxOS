import { ImageResponse } from 'next/og';
import { projects } from '@/data/projects';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project');
  const theme = searchParams.get('theme') || 'blackbox';

  const project = projects.find((p) => p.id === projectId);

  // Theme colors
  const colors = theme === 'heist'
    ? {
        bg: '#0f0a0a',
        fg: '#f5f0e8',
        accent: '#e85d4c',
        border: '#2d1f1f',
        muted: '#8a7a6a',
      }
    : {
        bg: '#0a0a0a',
        fg: '#f0f0f0',
        accent: '#3b82f6',
        border: '#1a1a1a',
        muted: '#666666',
      };

  if (!project) {
    // Default OG image for site
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.bg,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 700, color: colors.fg }}>
            BLACKBOX OS
          </div>
          <div style={{ fontSize: 24, color: colors.muted, marginTop: 16 }}>
            3D Portfolio · Project Vault
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.bg,
          fontFamily: 'system-ui, sans-serif',
          padding: 60,
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${colors.border} 1px, transparent 1px), linear-gradient(90deg, ${colors.border} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.3,
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: colors.accent,
            }}
          />
          <span style={{ fontSize: 14, color: colors.muted, letterSpacing: 2, textTransform: 'uppercase' }}>
            BLACKBOX OS
          </span>
        </div>

        {/* Category & Year */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <span
            style={{
              fontSize: 14,
              color: colors.accent,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {project.category}
          </span>
          <span style={{ fontSize: 14, color: colors.muted }}>·</span>
          <span style={{ fontSize: 14, color: colors.muted }}>{project.year}</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: colors.fg,
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          {project.title}
        </div>

        {/* Context */}
        <div
          style={{
            fontSize: 24,
            color: colors.muted,
            lineHeight: 1.4,
            maxWidth: 800,
            marginBottom: 40,
          }}
        >
          {project.context.length > 150
            ? project.context.slice(0, 150) + '...'
            : project.context}
        </div>

        {/* Stack chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>
          {project.stack.slice(0, 6).map((tech) => (
            <span
              key={tech}
              style={{
                fontSize: 12,
                color: colors.fg,
                backgroundColor: colors.border,
                padding: '6px 12px',
                borderRadius: 4,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

