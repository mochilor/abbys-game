import RoomName from '../../Scene/Main/Map/RoomName';
import Spear from '../../Scene/Main/Sprite/Collidable/Static/Enemy/Spear';
import Player from '../../Scene/Main/Sprite/Player/Player';
import * as EventDispatcher from '../EventDispatcher';

export default function listenSoundEvents(scene: Phaser.Scene): void {
  const coinSample = scene.sound.add('coinSample', { volume: 0.5 });

  const springSample = scene.sound.add('springSample', { volume: 0.7 });

  const portalSample = scene.sound.add('portalSample', { volume: 0.5 });

  const spearSample = scene.sound.add('spearSample', { volume: 0.2 });

  const saveSample = scene.sound.add('saveSample', { volume: 0.7 });

  const buttonSample = scene.sound.add('buttonSample', { volume: 0.9 });

  const doorSample = scene.sound.add('doorSample', { volume: 0.5 });

  function playCoinSample(room: string, playSound: boolean): void {
    if (playSound) {
      coinSample.play();
    }
  }

  function playSpringSample(): void {
    springSample.play();
  }

  function playPortalSample(
    newRoomData: RoomName,
    oldRoomData: RoomName,
    player: Player,
    isPortal: boolean = false,
  ): void {
    if (isPortal) {
      portalSample.play();
    }
  }

  function playSpearSample(spear: Spear): void {
    if (!spearSample.isPlaying && scene.cameras.main.worldView.contains(spear.x, spear.y)) {
      spearSample.play();
    }
  }

  function playSaveSample(): void {
    saveSample.play();
  }

  function playButtonSample(): void {
    buttonSample.play();
  }

  function playDoorSample(): void {
    doorSample.play();
  }

  EventDispatcher.on('playerGotCoin', playCoinSample);
  EventDispatcher.on('springActivated', playSpringSample);
  EventDispatcher.on('newRoomReached', playPortalSample);
  EventDispatcher.on('spearMoving', playSpearSample);
  EventDispatcher.on('gameSaved', playSaveSample);
  EventDispatcher.on('buttonActivated', playButtonSample);
  EventDispatcher.on('doorOpen', playDoorSample);
}
