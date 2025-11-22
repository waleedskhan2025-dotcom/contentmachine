import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { LyricLine } from '../types/project';
import { formatTime } from '../utils/timeFormatter';

interface PreviewProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  lyrics: LyricLine[];
  template: {
    backgroundColor: string;
    textColor: string;
    fontSize: number;
    aspectRatio: '9:16' | '16:9' | '1:1';
  };
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

export function Preview({
  currentTime,
  duration,
  isPlaying,
  lyrics,
  template,
  onPlayPause,
  onSeek,
}: PreviewProps) {
  // Find active lyric at current time
  const activeLyric = lyrics.find(
    (lyric) => currentTime >= lyric.startTime && currentTime <= lyric.endTime
  );

  // Calculate preview dimensions based on aspect ratio
  const getPreviewStyle = () => {
    const baseHeight = 400;
    let width = 225; // 9:16 default
    let height = baseHeight;

    if (template.aspectRatio === '16:9') {
      width = 711;
      height = baseHeight;
    } else if (template.aspectRatio === '1:1') {
      width = baseHeight;
      height = baseHeight;
    }

    return { width, height };
  };

  const previewStyle = getPreviewStyle();

  const handleSkipBack = () => {
    onSeek(Math.max(0, currentTime - 5));
  };

  const handleSkipForward = () => {
    onSeek(Math.min(duration, currentTime + 5));
  };

  return (
    <div className="preview">
      <h2>Preview</h2>
      <div
        className="preview-screen"
        style={{
          backgroundColor: template.backgroundColor,
          width: `${previewStyle.width}px`,
          height: `${previewStyle.height}px`,
        }}
      >
        {activeLyric && (
          <div
            className="preview-lyric"
            style={{
              color: template.textColor,
              fontSize: `${template.fontSize * 0.4}px`, // Scaled down for preview
            }}
          >
            {activeLyric.text}
          </div>
        )}
      </div>

      <div className="preview-controls">
        <button onClick={handleSkipBack}>
          <SkipBack size={20} />
        </button>
        <button onClick={onPlayPause} className="play-pause">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={handleSkipForward}>
          <SkipForward size={20} />
        </button>
      </div>

      <div className="time-display">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}
