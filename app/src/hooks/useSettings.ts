import { useState, useEffect } from 'react';
import type { Settings } from '../types/openrouter';

const SETTINGS_KEY = 'smashcut-settings';

const defaultSettings: Settings = {
  apiKey: '',
  selectedModel: null,
  enableWebSearch: false,
  webSearchEngine: 'auto',
  webSearchMaxResults: 5,
  enableStructuredOutputs: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateApiKey = (apiKey: string) => {
    setSettings((prev) => ({ ...prev, apiKey }));
  };

  const updateSelectedModel = (selectedModel: string | null) => {
    setSettings((prev) => ({ ...prev, selectedModel }));
  };

  const updateWebSearchEnabled = (enableWebSearch: boolean) => {
    setSettings((prev) => ({ ...prev, enableWebSearch }));
  };

  const updateWebSearchEngine = (webSearchEngine: 'native' | 'exa' | 'auto') => {
    setSettings((prev) => ({ ...prev, webSearchEngine }));
  };

  const updateWebSearchMaxResults = (webSearchMaxResults: number) => {
    setSettings((prev) => ({ ...prev, webSearchMaxResults }));
  };

  const updateStructuredOutputsEnabled = (enableStructuredOutputs: boolean) => {
    setSettings((prev) => ({ ...prev, enableStructuredOutputs }));
  };

  return {
    settings,
    updateApiKey,
    updateSelectedModel,
    updateWebSearchEnabled,
    updateWebSearchEngine,
    updateWebSearchMaxResults,
    updateStructuredOutputsEnabled,
  };
}
