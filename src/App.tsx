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
        <h1>🖨️ ePOS Print - PDF POC</h1>
        <p>Imprime archivos PDF en impresoras Epson POS con ePOS Print</p>
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
          POC para impresión de PDF usando{' '}
          <a href="https://reference.epson-biz.com/modules/ref_epos_sdk_js/index.php" target="_blank" rel="noopener noreferrer">
            Epson ePOS Print SDK
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
