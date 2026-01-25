'use client';

import { useEffect, useState, useRef } from 'react';
import { useModeStore } from '@/lib/mode-store';
import { useVaultStore } from '@/lib/store';
import { shouldRunFx, getTypeSpeed } from '@/lib/motion';
import { 
  type TerminalLog, 
  getTerminalLogs, 
  subscribeTerminalLogs 
} from '@/lib/terminal';

/**
 * TerminalOverlay - System logs with type animation
 * Bottom-left position, max 8 lines, pointer-events: none
 */
export function TerminalOverlay() {
  const mode = useModeStore((s) => s.mode);
  const qualityPreset = useVaultStore((s) => s.qualityPreset);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [shouldRender, setShouldRender] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if we should render based on quality preferences
  useEffect(() => {
    setShouldRender(shouldRunFx(qualityPreset));
  }, [qualityPreset]);

  // Subscribe to terminal logs
  useEffect(() => {
    setLogs(getTerminalLogs());
    return subscribeTerminalLogs(setLogs);
  }, []);

  // Don't render in LOW quality or reduced motion
  if (!shouldRender || logs.length === 0) return null;

  const typeSpeed = getTypeSpeed(qualityPreset);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-20 left-4 z-50 pointer-events-none font-mono text-[10px] leading-relaxed"
      style={{ maxWidth: '320px' }}
    >
      {logs.map((log, index) => (
        <TerminalLine 
          key={log.id} 
          log={log} 
          typeSpeed={typeSpeed}
          isOverdrive={mode === 'overdrive'}
          delay={index * 50}
        />
      ))}
    </div>
  );
}

interface TerminalLineProps {
  log: TerminalLog;
  typeSpeed: number;
  isOverdrive: boolean;
  delay: number;
}

function TerminalLine({ log, typeSpeed, isOverdrive, delay }: TerminalLineProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Instant display if not overdrive or instant speed
    if (!isOverdrive || typeSpeed === Infinity) {
      setDisplayText(log.message);
      setIsComplete(true);
      return;
    }

    // Type animation
    let currentIndex = 0;
    const interval = 1000 / typeSpeed;
    
    const startTimeout = setTimeout(() => {
      const typeInterval = setInterval(() => {
        currentIndex++;
        setDisplayText(log.message.slice(0, currentIndex));
        
        if (currentIndex >= log.message.length) {
          clearInterval(typeInterval);
          setIsComplete(true);
        }
      }, interval);
      
      return () => clearInterval(typeInterval);
    }, delay);
    
    return () => clearTimeout(startTimeout);
  }, [log.message, typeSpeed, isOverdrive, delay]);

  const levelColor = {
    info: 'text-foreground/50',
    warn: 'text-yellow-500/70',
    error: 'text-red-500/70',
    success: 'text-green-500/70',
  }[log.level];

  return (
    <div 
      className={`${levelColor} transition-opacity duration-300`}
      style={{ opacity: isComplete ? 0.6 : 0.8 }}
    >
      {displayText}
      {!isComplete && <span className="animate-pulse">▌</span>}
    </div>
  );
}

