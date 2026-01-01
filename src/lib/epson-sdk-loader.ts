/**
 * Dynamic loader for Epson ePOS SDK
 * Implements singleton pattern to avoid multiple loads
 */

import { debug, warn, error } from './logger';

interface LoaderState {
  loading: boolean;
  loaded: boolean;
  error: Error | null;
  promise: Promise<boolean> | null;
}

const state: LoaderState = {
  loading: false,
  loaded: false,
  error: null,
  promise: null,
};

/**
 * Check if SDK is already available in window
 */
export function isEpsonSDKLoaded(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.epson !== 'undefined' &&
    typeof window.epson.ePOSPrint !== 'undefined'
  );
}

/**
 * Get the SDK path - can be customized based on environment
 */
function getSDKPath(): string {
  // In development mode, load from public folder
  if (import.meta.env.DEV) {
    return '/epos-2.27.0.js';
  }
  
  // In production/library mode, load from bundled assets
  // The SDK will be in dist/assets after build
  try {
    return new URL('../../dist/assets/epos-2.27.0.js', import.meta.url).href;
  } catch {
    // Fallback to relative path
    return '/epos-2.27.0.js';
  }
}

/**
 * Load SDK script dynamically
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      debug('Epson SDK loaded successfully from:', src);
      resolve();
    };

    script.onerror = (err) => {
      error('Failed to load Epson SDK from:', src, err);
      reject(new Error(`Failed to load Epson SDK from ${src}`));
    };

    document.head.appendChild(script);
  });
}

/**
 * Wait for SDK to be available in window with timeout
 */
function waitForSDKAvailable(maxWait: number = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    const start = Date.now();
    
    const check = () => {
      if (isEpsonSDKLoaded()) {
        resolve(true);
        return;
      }
      
      if (Date.now() - start > maxWait) {
        warn('Timeout waiting for Epson SDK to be available');
        resolve(false);
        return;
      }
      
      setTimeout(check, 100);
    };
    
    check();
  });
}

/**
 * Load Epson SDK dynamically (singleton pattern)
 * Returns true if loaded successfully, false otherwise
 */
export async function loadEpsonSDK(options?: {
  sdkPath?: string;
  timeout?: number;
}): Promise<boolean> {
  // Already loaded
  if (state.loaded || isEpsonSDKLoaded()) {
    state.loaded = true;
    state.loading = false;
    return true;
  }

  // Currently loading - return existing promise
  if (state.loading && state.promise) {
    return state.promise;
  }

  // Start loading
  state.loading = true;
  state.error = null;

  state.promise = (async () => {
    try {
      const sdkPath = options?.sdkPath || getSDKPath();
      const timeout = options?.timeout || 10000;

      debug('Loading Epson SDK from:', sdkPath);

      // Load the script
      await loadScript(sdkPath);

      // Wait for SDK to be available
      const available = await waitForSDKAvailable(timeout);

      if (!available) {
        throw new Error('Epson SDK loaded but not available in window.epson');
      }

      state.loaded = true;
      state.loading = false;
      debug('Epson SDK ready');
      return true;

    } catch (err) {
      state.error = err instanceof Error ? err : new Error(String(err));
      state.loading = false;
      state.loaded = false;
      error('Failed to load Epson SDK:', state.error);
      return false;
    }
  })();

  return state.promise;
}

/**
 * Get current loader state
 */
export function getLoaderState(): Readonly<LoaderState> {
  return { ...state };
}

/**
 * Reset loader state (useful for testing)
 */
export function resetLoaderState(): void {
  state.loading = false;
  state.loaded = false;
  state.error = null;
  state.promise = null;
}

/**
 * Get Epson SDK (throws if not loaded)
 */
export function getEpsonSDK(): typeof window.epson {
  if (!isEpsonSDKLoaded()) {
    throw new Error(
      'Epson SDK not loaded. Call loadEpsonSDK() first or wait for automatic loading.'
    );
  }
  return window.epson;
}

/**
 * Initialize SDK (optional - for eager loading)
 */
export async function initializeEpsonSDK(options?: {
  sdkPath?: string;
  timeout?: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const loaded = await loadEpsonSDK(options);
    
    if (!loaded) {
      const loaderState = getLoaderState();
      return {
        success: false,
        error: loaderState.error?.message || 'Failed to load Epson SDK',
      };
    }
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
