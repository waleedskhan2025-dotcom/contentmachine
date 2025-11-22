import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { LyricLine } from '../types/project';

interface TimelineProps {
  audioFile: string;
  lyrics: LyricLine[];
  currentTime: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
}

export function Timeline({
  audioFile,
  lyrics,
  currentTime,
  isPlaying,
  onSeek,
  onPlay,
  onPause,
}: TimelineProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current || !audioFile) return;

    // Create WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4a5568',
      progressColor: '#3b82f6',
      cursorColor: '#ef4444',
      barWidth: 2,
      barRadius: 3,
      height: 100,
      normalize: true,
      backend: 'WebAudio',
    });

    wavesurferRef.current = wavesurfer;

    // Load audio file
    wavesurfer.load(`file://${audioFile}`);

    // Handle seeking
    wavesurfer.on('seeking', (seekTime) => {
      onSeek(seekTime);
    });

    wavesurfer.on('click', (relativeX) => {
      const duration = wavesurfer.getDuration();
      const seekTime = relativeX * duration;
      onSeek(seekTime);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [audioFile]);

  // Sync playback state
  useEffect(() => {
    if (!wavesurferRef.current) return;

    if (isPlaying) {
      wavesurferRef.current.play();
    } else {
      wavesurferRef.current.pause();
    }
  }, [isPlaying]);

  // Update current time
  useEffect(() => {
    if (!wavesurferRef.current || isPlaying) return;
    wavesurferRef.current.setTime(currentTime);
  }, [currentTime, isPlaying]);

  return (
    <div className="timeline">
      <div ref={waveformRef} className="waveform" />
      <div className="lyric-markers">
        {lyrics.map((lyric) => {
          const duration = wavesurferRef.current?.getDuration() || 1;
          const startPercent = (lyric.startTime / duration) * 100;
          const widthPercent = ((lyric.endTime - lyric.startTime) / duration) * 100;

          return (
            <div
              key={lyric.id}
              className="lyric-marker"
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
              }}
              title={lyric.text}
            />
          );
        })}
      </div>
    </div>
  );
}
