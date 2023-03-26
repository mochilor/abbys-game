import { Settings } from './types';

let settings: Settings = null;

function initSettings(storedSettings?: Settings): void {
  if (storedSettings) {
    settings = storedSettings;
    return;
  }

  settings = {
    audio: true,
  };
}

function isInitialized(): boolean {
  return settings !== null;
}

function getSettings(): Settings {
  if (!settings) {
    throw new Error('Settings must be initialized first!');
  }

  return settings;
}

export { initSettings, isInitialized, getSettings };
