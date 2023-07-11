import RoomName from '../../Scene/Main/Map/RoomName';
import Spear from '../../Scene/Main/Sprite/Collidable/Static/Enemy/Spear';
import Player from '../../Scene/Main/Sprite/Player/Player';
import * as EventDispatcher from '../EventDispatcher';
import { SoundPlayer } from '../types';

export default function listenSoundEvents(scene: Phaser.Scene, soundPlayer: SoundPlayer): void {
  function playCoinSample(room: string, playSound: boolean): void {
    if (playSound) {
      soundPlayer.playCoinSample();
    }
  }

  function playSpringSample(): void {
    soundPlayer.playSpringSample();
  }

  function playPortalSample(
    newRoomData: RoomName,
    oldRoomData: RoomName,
    player: Player,
    isPortal: boolean = false,
  ): void {
    if (isPortal) {
      soundPlayer.playPortalSample();
    }
  }

  function playSpearSample(spear: Spear): void {
    if (scene.cameras.main.worldView.contains(spear.x, spear.y)) {
      soundPlayer.playSpearSample();
    }
  }

  function playSaveSample(): void {
    soundPlayer.playSaveSample();
  }

  function playButtonSample(): void {
    soundPlayer.playButtonSample();
  }

  function playDoorSample(): void {
    soundPlayer.playDoorSample();
  }

  function fadeTitleMusic(): void {
    soundPlayer.fadeTitleMusic();
  }

  function playEndingMusic(): void {
    soundPlayer.playEndingMusic();
  }

  function prepareEndingMusic(): void {
    soundPlayer.prepareEndingMusic();
  }

  EventDispatcher.on('playerGotCoin', playCoinSample);
  EventDispatcher.on('springActivated', playSpringSample);
  EventDispatcher.on('newRoomReached', playPortalSample);
  EventDispatcher.on('spearMoving', playSpearSample);
  EventDispatcher.on('gameSaved', playSaveSample);
  EventDispatcher.on('buttonActivated', playButtonSample);
  EventDispatcher.on('doorOpen', playDoorSample);
  EventDispatcher.on('titleClosed', fadeTitleMusic);
  EventDispatcher.on('anchorTouchedBottom', prepareEndingMusic);
  EventDispatcher.on('anchorTouchedBottom', playDoorSample);
  EventDispatcher.on('anchorTouchedTop', playEndingMusic);
}
