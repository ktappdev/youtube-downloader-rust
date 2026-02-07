import { createContext, useContext, useState, ReactNode } from 'react';

export type DownloadMode = 'audio' | 'video' | 'playlist';
export type AudioMode = 'official' | 'raw' | 'clean';

interface DownloadState {
  url: string;
  mode: DownloadMode;
  audioMode: AudioMode;
  downloadPath: string;
  inputText: string;
  progress: number;
  status: string;
  itemCount: number;
  currentItem: number;
}

interface DownloadStoreContextType extends DownloadState {
  setUrl: (url: string) => void;
  setMode: (mode: DownloadMode) => void;
  setAudioMode: (audioMode: AudioMode) => void;
  setDownloadPath: (path: string) => void;
  setInputText: (text: string) => void;
  setProgress: (progress: number) => void;
  setStatus: (status: string) => void;
  setItemCount: (count: number) => void;
  setCurrentItem: (item: number) => void;
  reset: () => void;
}

const defaultState: DownloadState = {
  url: '',
  mode: 'video',
  audioMode: 'official',
  downloadPath: '',
  inputText: '',
  progress: 0,
  status: '',
  itemCount: 0,
  currentItem: 0,
};

const DownloadStoreContext = createContext<DownloadStoreContextType | undefined>(undefined);

export function DownloadProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DownloadState>(defaultState);

  const setUrl = (url: string) => {
    setState(prev => ({ ...prev, url }));
  };

  const setMode = (mode: DownloadMode) => {
    setState(prev => ({ ...prev, mode }));
  };

  const setAudioMode = (audioMode: AudioMode) => {
    setState(prev => ({ ...prev, audioMode }));
  };

  const setDownloadPath = (downloadPath: string) => {
    setState(prev => ({ ...prev, downloadPath }));
  };

  const setInputText = (inputText: string) => {
    setState(prev => ({ ...prev, inputText }));
  };

  const setProgress = (progress: number) => {
    setState(prev => ({ ...prev, progress }));
  };

  const setStatus = (status: string) => {
    setState(prev => ({ ...prev, status }));
  };

  const setItemCount = (itemCount: number) => {
    setState(prev => ({ ...prev, itemCount }));
  };

  const setCurrentItem = (currentItem: number) => {
    setState(prev => ({ ...prev, currentItem }));
  };

  const reset = () => {
    setState(defaultState);
  };

  return (
    <DownloadStoreContext.Provider
      value={{
        ...state,
        setUrl,
        setMode,
        setAudioMode,
        setDownloadPath,
        setInputText,
        setProgress,
        setStatus,
        setItemCount,
        setCurrentItem,
        reset,
      }}
    >
      {children}
    </DownloadStoreContext.Provider>
  );
}

export function useDownloadStore() {
  const context = useContext(DownloadStoreContext);
  if (context === undefined) {
    throw new Error('useDownloadStore must be used within a DownloadProvider');
  }
  return context;
}
