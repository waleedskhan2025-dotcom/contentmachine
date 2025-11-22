import { Project } from './project';

export interface ElectronAPI {
  importAudio: () => Promise<{ filePath: string; duration: number } | null>;
  renderVideo: (project: Project, outputPath: string) => Promise<void>;
  saveProject: (project: Project, filePath: string) => Promise<void>;
  loadProject: (filePath: string) => Promise<Project | null>;
  selectOutputPath: () => Promise<string | null>;
  onRenderProgress: (callback: (percent: number) => void) => void;
  onRenderComplete: (callback: (outputPath: string) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
