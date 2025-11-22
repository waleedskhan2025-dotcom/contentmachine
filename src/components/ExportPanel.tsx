import { useState, useEffect } from 'react';
import { Video, Download } from 'lucide-react';
import { Project } from '../types/project';

interface ExportPanelProps {
  project: Project;
  canExport: boolean;
}

export function ExportPanel({ project, canExport }: ExportPanelProps) {
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [lastExportPath, setLastExportPath] = useState<string | null>(null);

  useEffect(() => {
    window.electronAPI.onRenderProgress((percent) => {
      setRenderProgress(percent);
    });

    window.electronAPI.onRenderComplete((outputPath) => {
      setIsRendering(false);
      setRenderProgress(0);
      setLastExportPath(outputPath);
    });
  }, []);

  const handleExport = async () => {
    const outputPath = await window.electronAPI.selectOutputPath();
    if (!outputPath) return;

    setIsRendering(true);
    setRenderProgress(0);
    setLastExportPath(null);

    try {
      await window.electronAPI.renderVideo(project, outputPath);
    } catch (error) {
      console.error('Export failed:', error);
      setIsRendering(false);
      alert('Failed to export video. Check console for details.');
    }
  };

  return (
    <div className="export-panel">
      <h2>Export</h2>

      <div className="export-settings">
        <div className="setting-row">
          <label>Resolution:</label>
          <span>
            {project.template.aspectRatio === '9:16' && '1080x1920 (Vertical)'}
            {project.template.aspectRatio === '16:9' && '1920x1080 (Horizontal)'}
            {project.template.aspectRatio === '1:1' && '1080x1080 (Square)'}
          </span>
        </div>
        <div className="setting-row">
          <label>Format:</label>
          <span>MP4 (H.264)</span>
        </div>
        <div className="setting-row">
          <label>Lyrics Count:</label>
          <span>{project.lyrics.length}</span>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={!canExport || isRendering}
        className="export-button"
      >
        {isRendering ? (
          <>
            <Video size={20} className="spinning" />
            <span>Rendering... {renderProgress}%</span>
          </>
        ) : (
          <>
            <Download size={20} />
            <span>Render Video</span>
          </>
        )}
      </button>

      {isRendering && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${renderProgress}%` }}
          />
        </div>
      )}

      {lastExportPath && (
        <div className="export-success">
          ✅ Video exported successfully to: {lastExportPath}
        </div>
      )}
    </div>
  );
}
