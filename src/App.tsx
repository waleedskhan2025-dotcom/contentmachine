import { useEffect } from 'react';
import { AudioImport } from './components/AudioImport';
import { LyricEditor } from './components/LyricEditor';
import { Timeline } from './components/Timeline';
import { Preview } from './components/Preview';
import { ExportPanel } from './components/ExportPanel';
import { useProject } from './hooks/useProject';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import './App.css';

function App() {
  const {
    project,
    setAudioFile,
    addLyric,
    updateLyric,
    deleteLyric,
  } = useProject();

  const {
    isPlaying,
    currentTime,
    duration,
    load,
    togglePlayPause,
    seek,
  } = useAudioPlayer();

  const handleAudioImport = (filePath: string, audioDuration: number) => {
    setAudioFile(filePath, audioDuration);
    load(filePath);
  };

  const hasAudio = project.audioFile !== '';
  const canExport = hasAudio && project.lyrics.length > 0;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎵 Lyric Video Generator</h1>
        <p className="subtitle">Create engaging lyric videos for your music</p>
      </header>

      <div className="app-content">
        <div className="left-panel">
          <AudioImport onImport={handleAudioImport} hasAudio={hasAudio} />

          {hasAudio && (
            <>
              <Timeline
                audioFile={project.audioFile}
                lyrics={project.lyrics}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onSeek={seek}
                onPlay={() => togglePlayPause()}
                onPause={() => togglePlayPause()}
              />

              <LyricEditor
                lyrics={project.lyrics}
                currentTime={currentTime}
                onAdd={addLyric}
                onUpdate={updateLyric}
                onDelete={deleteLyric}
              />
            </>
          )}
        </div>

        <div className="right-panel">
          {hasAudio && (
            <>
              <Preview
                currentTime={currentTime}
                duration={duration}
                isPlaying={isPlaying}
                lyrics={project.lyrics}
                template={project.template}
                onPlayPause={togglePlayPause}
                onSeek={seek}
              />

              <ExportPanel project={project} canExport={canExport} />
            </>
          )}

          {!hasAudio && (
            <div className="empty-state">
              <h2>👈 Start by importing an audio file</h2>
              <p>Once you've loaded your music, you can add lyrics and create your video!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
