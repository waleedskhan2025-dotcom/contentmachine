# Lyric Video Generator 🎵

A desktop application for automating short-form lyric video creation for music promotion.

## Overview

Content Machine (Lyric Video Generator) is a powerful Electron-based desktop application that helps musicians and content creators quickly produce engaging lyric videos for social media and promotional purposes. This is a Phase 1 MVP focusing on core functionality.

## Features (Phase 1 MVP)

✅ **Audio Import** - Load MP3/WAV/OGG/M4A files
✅ **Manual Lyric Input** - Text editor with timestamp controls
✅ **Basic Preview** - See lyrics synced to audio playback with waveform visualization
✅ **Simple Template** - Clean, modern text style with fade animation
✅ **Video Export** - Render to 1080x1920 MP4 (vertical format for social media)

## Technology Stack

- **Electron** - Cross-platform desktop app framework
- **React** - UI components
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **FFmpeg** - Video rendering engine
- **WaveSurfer.js** - Audio waveform visualization

## Installation

### Prerequisites

- Node.js 18+ and npm
- FFmpeg will be automatically installed via `@ffmpeg-installer/ffmpeg`

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd contentmachine
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the application in development mode:

```bash
npm run electron:dev
```

This will:
- Start the Vite dev server on http://localhost:5173
- Launch the Electron app with hot-reload enabled
- Open DevTools automatically

## Building

Build the application for production:

```bash
npm run electron:build
```

This will create distributable packages in the `release/` directory for your platform:
- **macOS**: DMG installer
- **Windows**: NSIS installer
- **Linux**: AppImage

## Usage

### 1. Import Audio
Click "Import Audio File" and select your music file (MP3, WAV, OGG, or M4A).

### 2. Add Lyrics
- Play the audio to find the timing for each lyric
- Type the lyric text in the input field
- Click "Add" to create a lyric line at the current playback position
- Use "Set Start" and "Set End" buttons to adjust timing precisely

### 3. Preview
Watch your lyric video in real-time as you scrub through the timeline or play the audio.

### 4. Export
Click "Render Video" to generate your final MP4 file. The video will be exported with:
- Resolution: 1080x1920 (vertical/portrait)
- Format: MP4 (H.264 video, AAC audio)
- Optimized for social media platforms

## Project Structure

```
contentmachine/
├── electron/              # Electron main process
│   ├── main.ts           # App entry point
│   ├── preload.ts        # IPC bridge
│   └── videoRenderer.ts  # FFmpeg video generation
├── src/                  # React application
│   ├── components/       # UI components
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Helper functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # React entry point
├── public/              # Static assets
└── package.json
```

## Roadmap

### Phase 1 (Current - MVP) ✅
- Manual lyric timing
- Single template
- Basic video export

### Phase 2 (Planned)
- Auto-sync using Whisper API
- Multiple templates and customization options
- Batch processing for multiple songs
- Background images/videos

### Phase 3 (Future)
- Advanced animations and effects
- Custom fonts and styling
- Cloud rendering
- Social media direct publishing

## Troubleshooting

### Audio file won't load
- Ensure the file format is supported (MP3, WAV, OGG, M4A)
- Check that the file is not corrupted

### Video export fails
- Verify FFmpeg is properly installed (should be automatic)
- Check that you have write permissions to the output directory
- Ensure there's enough disk space

### App won't start
- Delete `node_modules/` and run `npm install` again
- Clear the build cache: `rm -rf dist dist-electron`

## Contributing

This is a personal/team project. Contributions, issues, and feature requests are welcome!

## License

[Add your license here]

## Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for musicians and content creators**
