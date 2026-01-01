/**
 * @plevands/epson-thermal-printer
 * Main library exports
 */

// Core services
export { EposPrintService, checkEpsonSDKStatus } from './lib/epos-print';
export { 
  loadEpsonSDK, 
  isEpsonSDKLoaded, 
  initializeEpsonSDK,
  getEpsonSDK,
  getLoaderState,
  resetLoaderState,
} from './lib/epson-sdk-loader';
export { 
  processPdfPage, 
  processPdfFile,
  DEFAULT_PDF_CONFIG,
} from './lib/pdf-processor';
export { configureLogger, getLoggerConfig } from './lib/logger';

// React hooks
export { useEpsonPrinter } from './hooks/useEpsonPrinter';
export { usePrinterConfig } from './hooks/usePrinterConfig';
export { usePdfProcessor } from './hooks/usePdfProcessor';

// TypeScript types
export type {
  EpsonPrinterConfig,
  PrintResult,
  PrintOptions,
  PdfProcessingConfig,
  ProcessedPage,
  LoaderState,
  SDKLoadOptions,
  InitializeSDKResult,
  PrinterStatus,
  UseEpsonPrinterReturn,
  UsePrinterConfigReturn,
  UsePdfProcessorReturn,
  LogLevel,
  LogEntry,
  LoggerConfig,
} from './types';
