import { SoundPlayer } from './types';

let coinSample: Phaser.Sound.BaseSound = null;

let springSample: Phaser.Sound.BaseSound = null;

let portalSample: Phaser.Sound.BaseSound = null;

let spearSample: Phaser.Sound.BaseSound = null;

let saveSample: Phaser.Sound.BaseSound = null;

let buttonSample: Phaser.Sound.BaseSound = null;

let doorSample: Phaser.Sound.BaseSound = null;

let titleMusic: Phaser.Sound.BaseSound = null;

let init = false;

let musicIsPlaying = true;

export default function makeSoundPlayer(scene: Phaser.Scene): SoundPlayer {
  function initSamples(): void {
    coinSample = scene.sound.add('coinSample');

    springSample = scene.sound.add('springSample');

    portalSample = scene.sound.add('portalSample');

    spearSample = scene.sound.add('spearSample');

    saveSample = scene.sound.add('saveSample');

    buttonSample = scene.sound.add('buttonSample');

    doorSample = scene.sound.add('doorSample');

    titleMusic = scene.sound.add('titleMusic');

    init = true;
  }

  if (!init) {
    initSamples();
  }

  function playCoinSample(): void {
    coinSample.play({ volume: 0.5 });
  }

  function playSpringSample(): void {
    springSample.play({ volume: 0.7 });
  }

  function playPortalSample(): void {
    portalSample.play({ volume: 0.5 });
  }

  function playSpearSample(): void {
    if (!spearSample.isPlaying) {
      spearSample.play({ volume: 0.2, mute: musicIsPlaying });
    }
  }

  function playSaveSample(): void {
    // This sounds is played on start, because the player is touching a save game item,
    // therefore needs to be muted
    saveSample.play({ volume: 0.7, mute: musicIsPlaying });
  }

  function playButtonSample(): void {
    buttonSample.play({ volume: 0.9 });
  }

  function playDoorSample(): void {
    doorSample.play({ volume: 0.5 });
  }

  function playTitleMusic(): void {
    musicIsPlaying = true;
    titleMusic.play({ volume: 1, loop: true });
  }

  function fadeTitleMusic(): void {
    scene.tweens.add({
      targets: titleMusic,
      volume: 0,
      duration: 1000,
    });
    musicIsPlaying = false;
  }

  function stopTitleMusic(): void {
    titleMusic.stop();
    musicIsPlaying = false;
  }

  function setMuteStatus(status: boolean): void {
    scene.game.sound.mute = status;
  }

  return {
    playCoinSample,
    playSpringSample,
    playPortalSample,
    playSpearSample,
    playSaveSample,
    playButtonSample,
    playDoorSample,
    playTitleMusic,
    fadeTitleMusic,
    stopTitleMusic,
    setMuteStatus,
  };
}
