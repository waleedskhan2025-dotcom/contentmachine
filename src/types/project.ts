export interface LyricLine {
  id: string;
  text: string;
  startTime: number; // seconds
  endTime: number; // seconds
}

export interface Template {
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  animation: 'fade' | 'slide' | 'none';
  aspectRatio: '9:16' | '16:9' | '1:1';
}

export interface Project {
  id: string;
  name: string;
  audioFile: string; // file path
  duration: number; // seconds
  lyrics: LyricLine[];
  template: Template;
}

export const defaultTemplate: Template = {
  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  fontSize: 48,
  fontFamily: 'Arial',
  animation: 'fade',
  aspectRatio: '9:16',
};
