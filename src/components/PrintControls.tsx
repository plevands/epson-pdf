import { useState, useEffect } from 'react';
import { EposPrintService, checkEpsonSDKStatus } from '../lib/epos-print';
import { debug } from '../lib/logger';
import type { PrintResult, PrintOptions } from '../lib/epos-print';

interface PrintControlsProps {
  printerConfig: { printerIP: string; printerPort: number; deviceId: string } | null;
  pages: { base64: string; width: number; height: number; rasterBase64: string; canvas: HTMLCanvasElement }[];
}

export function PrintControls({ printerConfig, pages }: PrintControlsProps) {
  const [printing, setPrinting] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [result, setResult] = useState<PrintResult | null>(null);
  const [printAllPages, setPrintAllPages] = useState(true);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [addHeader, setAddHeader] = useState(false);
  const [headerText, setHeaderText] = useState('');
  const [addFooter, setAddFooter] = useState(false);
  const [footerText, setFooterText] = useState('');
  const [sdkStatus, setSdkStatus] = useState<{ loaded: boolean; classes: string[] }>({ loaded: false, classes: [] });
  
  // SDK print options
  const [halftone, setHalftone] = useState<0 | 1 | 2>(1); // 1 = ERROR_DIFFUSION (best quality)
  const [brightness, setBrightness] = useState(1.0);
  const [printMode, setPrintMode] = useState<'mono' | 'gray16'>('mono');

  // Check SDK status on mount
  useEffect(() => {
    const checkStatus = () => {
      const status = checkEpsonSDKStatus();
      setSdkStatus(status);
      debug('SDK Status:', status);
    };
    
    // Check immediately
    checkStatus();
    
    // Check again after a short delay (in case SDK loads async)
    const timer = setTimeout(checkStatus, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getPrintOptions = (): PrintOptions => ({
    halftone,
    brightness,
    mode: printMode,
    cut: true,
    align: 'center',
  });

  const handleTestConnection = async () => {
    if (!printerConfig) {
      setResult({ success: false, message: 'Configura la impresora primero' });
      return;
    }

    setTestingConnection(true);
    setResult(null);

    try {
      const service = new EposPrintService({
        printerIP: printerConfig.printerIP,
        printerPort: printerConfig.printerPort,
        deviceId: printerConfig.deviceId,
      }, getPrintOptions());

      const testResult = await service.testConnection();
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handlePrint = async () => {
    if (!printerConfig) {
      setResult({ success: false, message: 'Configura la impresora primero' });
      return;
    }

    if (pages.length === 0) {
      setResult({ success: false, message: 'No hay páginas para imprimir' });
      return;
    }

    setPrinting(true);
    setResult(null);

    try {
      const service = new EposPrintService({
        printerIP: printerConfig.printerIP,
        printerPort: printerConfig.printerPort,
        deviceId: printerConfig.deviceId,
      }, getPrintOptions());

      const pagesToPrint = printAllPages
        ? pages
        : selectedPages.map((i) => pages[i]).filter(Boolean);

      if (pagesToPrint.length === 0) {
        setResult({ success: false, message: 'No hay páginas seleccionadas' });
        setPrinting(false);
        return;
      }

      // Use the official SDK's printPages method with canvas elements
      const canvases = pagesToPrint.map(p => p.canvas);
      const printResult = await service.printPages(canvases, {
        header: addHeader && headerText ? headerText : undefined,
        footer: addFooter && footerText ? footerText : undefined,
        pageSeparator: true,
      });

      setResult(printResult);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setPrinting(false);
    }
  };

  const handlePrintTestPage = async () => {
    if (!printerConfig) {
      setResult({ success: false, message: 'Configura la impresora primero' });
      return;
    }

    setPrinting(true);
    setResult(null);

    try {
      const service = new EposPrintService({
        printerIP: printerConfig.printerIP,
        printerPort: printerConfig.printerPort,
        deviceId: printerConfig.deviceId,
      }, getPrintOptions());

      const printResult = await service.printTestPage();
      setResult(printResult);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setPrinting(false);
    }
  };

  const togglePageSelection = (pageIndex: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageIndex)
        ? prev.filter((i) => i !== pageIndex)
        : [...prev, pageIndex].sort((a, b) => a - b)
    );
  };

  return (
    <div className="print-controls">
      <h3>🖨️ Controles de Impresión</h3>

      {/* SDK Status */}
      <div className={`sdk-status ${sdkStatus.loaded ? 'sdk-loaded' : 'sdk-error'}`}>
        {sdkStatus.loaded ? (
          <>✅ Epson SDK cargado ({sdkStatus.classes.join(', ')})</>
        ) : (
          <>❌ Epson SDK no cargado - Recarga la página</>
        )}
      </div>

      <div className="control-section">
        <h4>Conexión</h4>
        <button
          onClick={handleTestConnection}
          disabled={testingConnection || !printerConfig || !sdkStatus.loaded}
          className="btn-test"
        >
          {testingConnection ? '⏳ Probando...' : '🔌 Probar Conexión'}
        </button>
        <button
          onClick={handlePrintTestPage}
          disabled={printing || !printerConfig || !sdkStatus.loaded}
          className="btn-test-print"
        >
          {printing ? '⏳ Imprimiendo...' : '📝 Imprimir Página de Prueba'}
        </button>
      </div>

      {pages.length > 0 && (
        <>
          <div className="control-section">
            <h4>Calidad de Impresión (SDK Oficial)</h4>
            
            <label className="select-label">
              Algoritmo de Halftone:
              <select 
                value={halftone} 
                onChange={(e) => setHalftone(Number(e.target.value) as 0 | 1 | 2)}
                className="select-input"
              >
                <option value={0}>Dither (rápido)</option>
                <option value={1}>Error Diffusion (mejor calidad)</option>
                <option value={2}>Threshold (alto contraste)</option>
              </select>
            </label>

            <label className="select-label">
              Brillo ({brightness.toFixed(1)}):
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
                className="range-input"
              />
            </label>

            <label className="select-label">
              Modo:
              <select 
                value={printMode} 
                onChange={(e) => setPrintMode(e.target.value as 'mono' | 'gray16')}
                className="select-input"
              >
                <option value="mono">Monocromático (1-bit)</option>
                <option value="gray16">Escala de grises (16 niveles)</option>
              </select>
            </label>
          </div>

          <div className="control-section">
            <h4>Opciones de Impresión</h4>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={printAllPages}
                onChange={(e) => setPrintAllPages(e.target.checked)}
              />
              Imprimir todas las páginas ({pages.length})
            </label>

            {!printAllPages && (
              <div className="page-selection">
                <p>Selecciona páginas:</p>
                <div className="page-buttons">
                  {pages.map((_, index) => (
                    <button
                      key={index}
                      className={`page-btn ${selectedPages.includes(index) ? 'selected' : ''}`}
                      onClick={() => togglePageSelection(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="control-section">
            <h4>Encabezado y Pie</h4>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={addHeader}
                onChange={(e) => setAddHeader(e.target.checked)}
              />
              Agregar encabezado
            </label>
            {addHeader && (
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="Texto del encabezado"
                className="text-input"
              />
            )}

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={addFooter}
                onChange={(e) => setAddFooter(e.target.checked)}
              />
              Agregar pie de página
            </label>
            {addFooter && (
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="Texto del pie de página"
                className="text-input"
              />
            )}
          </div>

          <div className="control-section">
            <button
              onClick={handlePrint}
              disabled={printing || !printerConfig}
              className="btn-print"
            >
              {printing ? '⏳ Imprimiendo...' : '🖨️ Imprimir PDF'}
            </button>
          </div>
        </>
      )}

      {result && (
        <div className={`print-result ${result.success ? 'success' : 'error'}`}>
          <p>
            {result.success ? '✅' : '❌'} {result.message}
          </p>
          {result.code && <p className="result-code">Código: {result.code}</p>}
        </div>
      )}
    </div>
  );
}
