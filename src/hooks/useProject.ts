import { useState } from 'react';
import { Project, LyricLine, defaultTemplate } from '../types/project';
import { v4 as uuidv4 } from 'uuid';

export function useProject() {
  const [project, setProject] = useState<Project>({
    id: uuidv4(),
    name: 'Untitled Project',
    audioFile: '',
    duration: 0,
    lyrics: [],
    template: defaultTemplate,
  });

  const setAudioFile = (filePath: string, duration: number) => {
    setProject((prev) => ({
      ...prev,
      audioFile: filePath,
      duration,
    }));
  };

  const addLyric = (text: string, startTime: number, endTime: number) => {
    const newLyric: LyricLine = {
      id: uuidv4(),
      text,
      startTime,
      endTime,
    };
    setProject((prev) => ({
      ...prev,
      lyrics: [...prev.lyrics, newLyric].sort((a, b) => a.startTime - b.startTime),
    }));
  };

  const updateLyric = (id: string, updates: Partial<LyricLine>) => {
    setProject((prev) => ({
      ...prev,
      lyrics: prev.lyrics
        .map((lyric) => (lyric.id === id ? { ...lyric, ...updates } : lyric))
        .sort((a, b) => a.startTime - b.startTime),
    }));
  };

  const deleteLyric = (id: string) => {
    setProject((prev) => ({
      ...prev,
      lyrics: prev.lyrics.filter((lyric) => lyric.id !== id),
    }));
  };

  const updateTemplate = (updates: Partial<Project['template']>) => {
    setProject((prev) => ({
      ...prev,
      template: { ...prev.template, ...updates },
    }));
  };

  return {
    project,
    setProject,
    setAudioFile,
    addLyric,
    updateLyric,
    deleteLyric,
    updateTemplate,
  };
}
