/**
 * React hook for managing printer configuration with localStorage persistence
 */

import { useState, useCallback, useEffect } from 'react';
import type { EpsonPrinterConfig, UsePrinterConfigReturn } from '../types';
import { error } from '../lib/logger';

const STORAGE_KEY = 'epson-printer-config';

const DEFAULT_CONFIG: EpsonPrinterConfig = {
  printerIP: '192.168.1.100',
  printerPort: 80,
  deviceId: 'local_printer',
  timeout: 60000,
};

export function usePrinterConfig(): UsePrinterConfigReturn {
  const [config, setConfig] = useState<EpsonPrinterConfig>(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (err) {
      error('Failed to load printer config from localStorage:', err);
    }
    return DEFAULT_CONFIG;
  });

  // Save to localStorage whenever config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
      error('Failed to save printer config to localStorage:', err);
    }
  }, [config]);

  const updateConfig = useCallback((newConfig: Partial<EpsonPrinterConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      error('Failed to remove printer config from localStorage:', err);
    }
  }, []);

  const isConfigured = Boolean(
    config.printerIP && 
    config.printerIP.trim() !== '' && 
    config.printerIP !== '0.0.0.0'
  );

  return {
    config,
    updateConfig,
    resetConfig,
    isConfigured,
  };
}
