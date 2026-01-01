import { useState, useCallback, useRef } from 'react';

interface PdfUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function PdfUploader({ onFileSelect, disabled }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert('Por favor selecciona un archivo PDF');
      }
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="pdf-uploader">
      <h3>📄 Subir Archivo PDF</h3>
      
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={disabled ? undefined : handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        
        {selectedFile ? (
          <div className="file-info">
            <span className="file-icon">📄</span>
            <div className="file-details">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">{formatFileSize(selectedFile.size)}</span>
            </div>
            <button 
              className="btn-clear"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="drop-message">
            <span className="drop-icon">📥</span>
            <p>Arrastra un archivo PDF aquí</p>
            <p className="drop-hint">o haz clic para seleccionar</p>
          </div>
        )}
      </div>
    </div>
  );
}
