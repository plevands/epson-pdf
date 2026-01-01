/**
 * Configurable logger for @plevands/epson-thermal-printer
 * - Errors are always shown in console
 * - Debug/warn logs are controlled by `enabled` config
 * - All logs can be intercepted via `onLog` callback
 */

import type { LogLevel, LogEntry, LoggerConfig } from '../types';

const config: LoggerConfig = {
  enabled: false,
  onLog: undefined,
};

/**
 * Configure the logger
 * @param newConfig - Logger configuration options
 */
export function configureLogger(newConfig: Partial<LoggerConfig>): void {
  if (newConfig.enabled !== undefined) {
    config.enabled = newConfig.enabled;
  }
  if (newConfig.onLog !== undefined) {
    config.onLog = newConfig.onLog;
  }
}

/**
 * Get current logger configuration
 */
export function getLoggerConfig(): Readonly<LoggerConfig> {
  return { ...config };
}

/**
 * Internal function to handle logging
 */
function log(level: LogLevel, message: string, ...args: unknown[]): void {
  const entry: LogEntry = {
    level,
    message,
    args: args.length > 0 ? args : undefined,
  };

  // Always call the callback if provided (for all levels including errors)
  if (config.onLog) {
    config.onLog(entry);
  }

  // Errors are always shown in console
  if (level === 'error') {
    console.error(`[epson-printer] ${message}`, ...args);
    return;
  }

  // Debug and warn only show if enabled
  if (config.enabled) {
    if (level === 'warn') {
      console.warn(`[epson-printer] ${message}`, ...args);
    } else {
      console.log(`[epson-printer] ${message}`, ...args);
    }
  }
}

/**
 * Log debug message (only when enabled)
 */
export function debug(message: string, ...args: unknown[]): void {
  log('debug', message, ...args);
}

/**
 * Log warning message (only when enabled)
 */
export function warn(message: string, ...args: unknown[]): void {
  log('warn', message, ...args);
}

/**
 * Log error message (always shown)
 */
export function error(message: string, ...args: unknown[]): void {
  log('error', message, ...args);
}

export const logger = {
  debug,
  warn,
  error,
  configure: configureLogger,
  getConfig: getLoggerConfig,
};
