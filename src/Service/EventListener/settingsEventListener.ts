import * as EventDispatcher from '../EventDispatcher';
import { loadSettings, saveSettings } from '../gameStore';
import { initSettings, getSettings, isInitialized } from '../Settings';
import { SoundPlayer } from '../types';

export default function listenSettingsEvents(soundPlayer: SoundPlayer): void {
  function init(): void {
    if (isInitialized()) {
      soundPlayer.setMuteStatus(!getSettings().audio);
      return;
    }

    const savedSettings = loadSettings();

    initSettings(savedSettings);

    soundPlayer.setMuteStatus(!getSettings().audio);
  }

  function soundToggled(): void {
    const settings = getSettings();
    settings.audio = !settings.audio;

    soundPlayer.setMuteStatus(!settings.audio);

    saveSettings(settings);
  }

  init();
  EventDispatcher.on('soundToggled', soundToggled);
}
