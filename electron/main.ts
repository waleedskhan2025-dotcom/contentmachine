import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers

ipcMain.handle('import-audio', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'm4a'] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];

  // Get audio duration using ffprobe (part of ffmpeg)
  const { getAudioDuration } = await import('./videoRenderer.js');
  const duration = await getAudioDuration(filePath);

  return { filePath, duration };
});

ipcMain.handle('select-output-path', async () => {
  const result = await dialog.showSaveDialog({
    defaultPath: 'lyric-video.mp4',
    filters: [{ name: 'Video Files', extensions: ['mp4'] }],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePath;
});

ipcMain.handle('save-project', async (_event, project, filePath) => {
  try {
    const data = JSON.stringify(project, null, 2);
    fs.writeFileSync(filePath, data, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving project:', error);
    return false;
  }
});

ipcMain.handle('load-project', async (_event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading project:', error);
    return null;
  }
});

ipcMain.handle('render-video', async (_event, project, outputPath) => {
  try {
    const { renderVideo } = await import('./videoRenderer.js');
    await renderVideo(project, outputPath, (progress) => {
      mainWindow?.webContents.send('render-progress', progress);
    });
    mainWindow?.webContents.send('render-complete', outputPath);
  } catch (error) {
    console.error('Error rendering video:', error);
    throw error;
  }
});
