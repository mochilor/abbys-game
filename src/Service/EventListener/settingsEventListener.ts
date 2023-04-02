import * as EventDispatcher from '../EventDispatcher';
import { hasSavedGame, loadGame } from '../gameStore';
import { initSettings, getSettings, isInitialized } from '../Settings';

export default function listenSettingsEvents(): void {
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

  init();
  EventDispatcher.on('soundToggled', soundToggled);
}
