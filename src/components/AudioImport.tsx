import { Upload } from 'lucide-react';

interface AudioImportProps {
  onImport: (filePath: string, duration: number) => void;
  hasAudio: boolean;
}

export function AudioImport({ onImport, hasAudio }: AudioImportProps) {
  const handleImport = async () => {
    const result = await window.electronAPI.importAudio();
    if (result) {
      onImport(result.filePath, result.duration);
    }
  };

  return (
    <div className="audio-import">
      <button onClick={handleImport} className="import-button">
        <Upload size={24} />
        <span>{hasAudio ? 'Change Audio File' : 'Import Audio File'}</span>
      </button>
      <p className="hint">Supported formats: MP3, WAV, OGG, M4A</p>
    </div>
  );
}
