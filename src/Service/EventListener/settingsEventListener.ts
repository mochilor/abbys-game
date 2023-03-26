import * as EventDispatcher from '../EventDispatcher';
import { hasSavedGame, loadGame } from '../gameStore';
import { initSettings, getSettings, isInitialized } from '../Settings';

function init(): void {
  if (isInitialized()) {
    return;
  }

  let savedSettings = null;
  if (hasSavedGame()) {
    savedSettings = loadGame().settings;
  }

  initSettings(savedSettings);
}

function soundToggled(): void {
  const settings = getSettings();
  settings.audio = !settings.audio;
}

export default function listenSettingsEvents(): void {
  init();
  EventDispatcher.on('soundToggled', soundToggled);
}
