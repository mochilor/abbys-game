import Player from '../../Scene/Main/Sprite/Player/Player';
import createPauseButton from '../../Scene/Main/UI/PauseButton';
import * as EventDispatcher from '../EventDispatcher';

export default function listenSceneEvents(scene: Phaser.Scene, player: Player): void {
  const pauseButton = createPauseButton(scene);
  pauseButton.hide();

  function unfreezePlayer(): void {
    player.unfreeze();
  }

  function createPause(): void {
    pauseButton.show();
    const escapeKey = scene.input.keyboard.addKey('ESC');
    escapeKey.on('down', pauseButton.pause);
  }

  function resetScene(): void {
    scene.registry.reset();
    scene.scene.restart({});
  }

  function hidePause(): void {
    pauseButton.hide();
  }

  EventDispatcher.on('playerUnfrozen', unfreezePlayer);
  EventDispatcher.on('playerUnfrozen', createPause);
  EventDispatcher.on('playerHasDied', resetScene);
  EventDispatcher.on('gameReset', resetScene);
  EventDispatcher.on('newRoomReached', scene.scene.restart, scene.scene);
  EventDispatcher.on('endingBackgroundComplete', hidePause);
  EventDispatcher.on('endingAnimationRunning', hidePause);
}
