import { useState, useEffect } from 'react';
import type { Settings } from '../types/openrouter';

const SETTINGS_KEY = 'smashcut-settings';

const defaultSettings: Settings = {
  apiKey: '',
  selectedModel: null,
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

  return {
    settings,
    updateApiKey,
    updateSelectedModel,
  };
}
