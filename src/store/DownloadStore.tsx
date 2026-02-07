import { createContext, useContext, useState, ReactNode } from 'react';

export type DownloadMode = 'audio' | 'video' | 'playlist';

interface DownloadState {
  url: string;
  mode: DownloadMode;
  downloadPath: string;
}

interface DownloadStoreContextType extends DownloadState {
  setUrl: (url: string) => void;
  setMode: (mode: DownloadMode) => void;
  setDownloadPath: (path: string) => void;
  reset: () => void;
}

const defaultState: DownloadState = {
  url: '',
  mode: 'video',
  downloadPath: '',
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

  const setDownloadPath = (downloadPath: string) => {
    setState(prev => ({ ...prev, downloadPath }));
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
        setDownloadPath,
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
