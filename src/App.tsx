import { useState, useCallback } from 'react';
import { PrinterConfig } from './components/PrinterConfig';
import { PdfUploader } from './components/PdfUploader';
import { PdfPreview } from './components/PdfPreview';
import { PrintControls } from './components/PrintControls';
import type { ProcessedPage } from './types';
import './App.css';

// Extended config for demo app (adds paperWidth)
interface PrinterConfigData {
  printerIP: string;
  printerPort: number;
  deviceId: string;
  paperWidth: number;
}

function App() {
  const [printerConfig, setPrinterConfig] = useState<PrinterConfigData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ProcessedPage[]>([]);

  const handleConfigChange = useCallback((config: PrinterConfigData) => {
    setPrinterConfig(config);
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setPages([]);
  }, []);

  const handlePagesLoaded = useCallback((loadedPages: ProcessedPage[]) => {
    setPages(loadedPages);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1><span className="header-icon">🖨️</span> <span className="header-title">epson-thermal-printer Demo</span></h1>
        <p>Ejemplo de uso de la librería <code>@plevands/epson-thermal-printer</code> para imprimir PDFs en impresoras Epson POS</p>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <PrinterConfig onConfigChange={handleConfigChange} />
          <PdfUploader onFileSelect={handleFileSelect} />
        </div>

        <div className="center-panel">
          <PdfPreview 
            file={selectedFile} 
            onPagesLoaded={handlePagesLoaded}
          />
        </div>

        <div className="right-panel">
          <PrintControls 
            printerConfig={printerConfig} 
            pages={pages} 
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Impresión de PDF usando Epson ePOS Print SDK
        </p>
      </footer>
    </div>
  );
}

export default App;
