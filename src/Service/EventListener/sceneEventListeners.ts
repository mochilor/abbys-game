import Player from '../../Scene/Main/Sprite/Player/Player';
import createPauseButton from '../../Scene/Main/UI/PauseButton';
import * as EventDispatcher from '../EventDispatcher';

export default function listenSceneEvents(scene: Phaser.Scene, player: Player): void {
  function unfreezePlayer(): void {
    player.unfreeze();
  }

  function createPause(): void {
    const pauseButton = createPauseButton(scene);
    const escapeKey = scene.input.keyboard.addKey('ESC');
    escapeKey.on('down', pauseButton.pause);
  }

  function resetScene(): void {
    scene.registry.reset();
    scene.scene.restart({});
  }

  EventDispatcher.on('playerUnfrozen', unfreezePlayer);
  EventDispatcher.on('playerUnfrozen', createPause);
  EventDispatcher.on('playerHasDied', resetScene);
  EventDispatcher.on('gameReset', resetScene);
  EventDispatcher.on('newRoomReached', scene.scene.restart, scene.scene);
}
