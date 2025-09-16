import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ApiMode = 'direct' | 'backend';

interface SettingsContextType {
  apiMode: ApiMode;
  setApiMode: (mode: ApiMode) => void;
  toggleApiMode: () => void;
  isDirectMode: () => boolean;
  isBackendMode: () => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'weather-app-api-mode';

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [apiMode, setApiModeState] = useState<ApiMode>('direct');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY) as ApiMode;
    if (savedMode && (savedMode === 'direct' || savedMode === 'backend')) {
      setApiModeState(savedMode);
    } else {
      // Default to direct mode
      setApiModeState('direct');
      localStorage.setItem(STORAGE_KEY, 'direct');
    }
  }, []);

  const setApiMode = (mode: ApiMode) => {
    setApiModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  const toggleApiMode = () => {
    const newMode = apiMode === 'direct' ? 'backend' : 'direct';
    setApiMode(newMode);
  };

  const isDirectMode = () => apiMode === 'direct';
  const isBackendMode = () => apiMode === 'backend';

  const value: SettingsContextType = {
    apiMode,
    setApiMode,
    toggleApiMode,
    isDirectMode,
    isBackendMode,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
