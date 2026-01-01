/**
 * React hook for PDF processing operations
 */

import { useState, useCallback } from 'react';
import { processPdfFile } from '../lib/pdf-processor';
import type { 
  PdfProcessingConfig, 
  ProcessedPage,
  UsePdfProcessorReturn,
} from '../types';

export function usePdfProcessor(
  config?: PdfProcessingConfig
): UsePdfProcessorReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File): Promise<ProcessedPage[]> => {
      setIsProcessing(true);
      setError(null);

      try {
        const pages = await processPdfFile(file, config);
        return pages;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to process PDF';
        setError(errorMessage);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [config]
  );

  return {
    processFile,
    isProcessing,
    error,
  };
}
