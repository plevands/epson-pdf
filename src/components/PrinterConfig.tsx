import { useState, useEffect, useCallback } from 'react';

interface PrinterConfigProps {
  onConfigChange: (config: { printerIP: string; printerPort: number; deviceId: string; paperWidth: number }) => void;
}

const STORAGE_KEY = 'epson-printer-config';

// Get initial config from localStorage
function getInitialConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const config = JSON.parse(saved);
      return {
        printerIP: config.printerIP || '192.168.1.100',
        printerPort: config.printerPort || 80,
        deviceId: config.deviceId || 'local_printer',
        paperWidth: config.paperWidth || 576,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return {
    printerIP: '192.168.1.100',
    printerPort: 80,
    deviceId: 'local_printer',
    paperWidth: 576,
  };
}

export function PrinterConfig({ onConfigChange }: PrinterConfigProps) {
  const initialConfig = getInitialConfig();
  const [printerIP, setPrinterIP] = useState(initialConfig.printerIP);
  const [printerPort, setPrinterPort] = useState(initialConfig.printerPort);
  const [deviceId, setDeviceId] = useState(initialConfig.deviceId);
  const [paperWidth, setPaperWidth] = useState(initialConfig.paperWidth);

  const notifyChange = useCallback((config: { printerIP: string; printerPort: number; deviceId: string; paperWidth: number }) => {
    onConfigChange(config);
  }, [onConfigChange]);

  // Notify parent of initial config on mount
  useEffect(() => {
    notifyChange(initialConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    const config = { printerIP, printerPort, deviceId, paperWidth };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    onConfigChange(config);
  };

  return (
    <div className="printer-config">
      <h3>⚙️ Configuración de Impresora</h3>
      
      <div className="config-form">
        <div className="form-group">
          <label htmlFor="printerIP">IP de la Impresora:</label>
          <input
            type="text"
            id="printerIP"
            value={printerIP}
            onChange={(e) => setPrinterIP(e.target.value)}
            placeholder="192.168.1.100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="printerPort">Puerto:</label>
          <input
            type="number"
            id="printerPort"
            value={printerPort}
            onChange={(e) => setPrinterPort(parseInt(e.target.value) || 80)}
            placeholder="80"
          />
        </div>

        <div className="form-group">
          <label htmlFor="deviceId">Device ID:</label>
          <input
            type="text"
            id="deviceId"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="local_printer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="paperWidth">Ancho de Papel:</label>
          <select
            id="paperWidth"
            value={paperWidth}
            onChange={(e) => setPaperWidth(parseInt(e.target.value))}
          >
            <option value={576}>80mm (576px)</option>
            <option value={384}>58mm (384px)</option>
          </select>
        </div>

        <button onClick={handleSave} className="btn-save">
          💾 Guardar Configuración
        </button>
      </div>

      <div className="config-help">
        <p>
          <strong>💡 Tip:</strong> Configura tu impresora Epson con ePOS habilitado.
          Puedes usar esta demo para probar la librería antes de integrarla en tu proyecto.
        </p>
      </div>
    </div>
  );
}
