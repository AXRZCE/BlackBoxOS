/**
 * BLACKBOX OS Terminal Log System
 * 
 * Queue-based system for terminal-style log messages
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'success';

export interface TerminalLog {
  id: string;
  message: string;
  level: LogLevel;
  timestamp: number;
}

// Log buffer (max 8 entries)
const MAX_LOGS = 8;
let logs: TerminalLog[] = [];
const listeners: Set<(logs: TerminalLog[]) => void> = new Set();
let idCounter = 0;

// Debounce timer
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 100;

/**
 * Add a log entry (debounced)
 */
export function terminalLog(message: string, level: LogLevel = 'info'): void {
  const log: TerminalLog = {
    id: `log-${++idCounter}`,
    message,
    level,
    timestamp: Date.now(),
  };

  // Debounce to avoid spamming
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    logs = [...logs, log].slice(-MAX_LOGS);
    notifyListeners();
  }, DEBOUNCE_MS);
}

/**
 * Clear all logs
 */
export function clearTerminalLogs(): void {
  logs = [];
  notifyListeners();
}

/**
 * Get current logs
 */
export function getTerminalLogs(): TerminalLog[] {
  return logs;
}

/**
 * Subscribe to log changes
 */
export function subscribeTerminalLogs(callback: (logs: TerminalLog[]) => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners(): void {
  listeners.forEach(callback => callback(logs));
}

// Preset log messages
export const LOG_MESSAGES = {
  boot_ok: '[SYS] BOOT_OK :: systems nominal',
  mode_stealth: '[MODE] STEALTH :: low profile active',
  mode_overdrive: '[MODE] OVERDRIVE :: all systems engaged',
  overdrive_unlock: '[UNLOCK] OVERDRIVE_ACCESS :: clearance granted',
  target_lock: (id: string) => `[TGT] LOCK :: ${id}`,
  casefile_open: (id: string) => `[FILE] ACCESS :: ${id}`,
  error: (msg: string) => `[ERR] ${msg}`,
} as const;

