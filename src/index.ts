import Phaser from 'phaser';
import Main from './Scene/Main/Main';
import Preload from './Scene/Preload/Preload';
import configuration from '../config/config.json';

const config = {
  type: Phaser.WEBGL,
  width: configuration.gameWidth,
  height: configuration.gameHeight,
  transparent: false,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: configuration.debug.boundingBoxes,
    },
  },
  scale: {
    parent: 'gamediv',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    Preload,
    Main,
  ],
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
