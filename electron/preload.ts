import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  importAudio: () => ipcRenderer.invoke('import-audio'),
  renderVideo: (project: any, outputPath: string) =>
    ipcRenderer.invoke('render-video', project, outputPath),
  saveProject: (project: any, filePath: string) =>
    ipcRenderer.invoke('save-project', project, filePath),
  loadProject: (filePath: string) =>
    ipcRenderer.invoke('load-project', filePath),
  selectOutputPath: () => ipcRenderer.invoke('select-output-path'),
  onRenderProgress: (callback: (percent: number) => void) => {
    ipcRenderer.on('render-progress', (_event, percent) => callback(percent));
  },
  onRenderComplete: (callback: (outputPath: string) => void) => {
    ipcRenderer.on('render-complete', (_event, outputPath) => callback(outputPath));
  },
});
