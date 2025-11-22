import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { Project } from '../src/types/project';

// Set the ffmpeg binary path
ffmpeg.setFfmpegPath(ffmpegPath.path);

export function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(metadata.format.duration || 0);
    });
  });
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/:/g, '\\:')
    .replace(/\n/g, ' ');
}

export function renderVideo(
  project: Project,
  outputPath: string,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const { audioFile, lyrics, template, duration } = project;

    // Calculate dimensions based on aspect ratio
    let width = 1080;
    let height = 1920;
    if (template.aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    } else if (template.aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    }

    // Build drawtext filters for each lyric line
    const drawtextFilters = lyrics.map((lyric, index) => {
      const escapedText = escapeText(lyric.text);
      const enable = `between(t,${lyric.startTime},${lyric.endTime})`;

      // Base drawtext filter
      let filter = `drawtext=text='${escapedText}'`;
      filter += `:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf`;
      filter += `:fontsize=${template.fontSize}`;
      filter += `:fontcolor=${template.textColor}`;
      filter += `:x=(w-text_w)/2`;
      filter += `:y=(h-text_h)/2`;
      filter += `:enable='${enable}'`;

      // Add fade animation if specified
      if (template.animation === 'fade') {
        const fadeDuration = 0.3;
        filter += `:alpha='if(lt(t,${lyric.startTime + fadeDuration}),(t-${lyric.startTime})/${fadeDuration},if(gt(t,${lyric.endTime - fadeDuration}),(${lyric.endTime}-t)/${fadeDuration},1))'`;
      }

      return filter;
    });

    // Combine all filters
    const filterComplex = drawtextFilters.join(',');

    const command = ffmpeg()
      .input(audioFile)
      .inputOptions([
        '-f', 'lavfi',
        '-i', `color=c=${template.backgroundColor}:s=${width}x${height}:d=${duration}`
      ])
      .complexFilter(filterComplex || 'nullsink')
      .outputOptions([
        '-map', '1:v',
        '-map', '0:a',
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest'
      ])
      .output(outputPath);

    command.on('progress', (progress) => {
      if (progress.percent) {
        onProgress(Math.round(progress.percent));
      }
    });

    command.on('end', () => {
      resolve();
    });

    command.on('error', (err) => {
      reject(err);
    });

    command.run();
  });
}
