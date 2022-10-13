import Phaser from 'phaser';
import Main from './Scene/Main/Main';
import configuration from '../config/config.json';
import BendWaves from './Scene/Main/Background/shader';

const style = configuration.style[0];

const config = {
  type: Phaser.WEBGL,
  width: configuration.gameWidth,
  height: configuration.gameHeight,
  transparent: false,
  backgroundColor: style.bg,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scale: {
    parent: 'gamediv',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    new Main(),
  ],
  pipeline: { BendWaves },
};

// eslint-disable-next-line no-new
new Phaser.Game(config);

(document.querySelector('body') as HTMLBodyElement).setAttribute('style', `background-color: ${style.bg};`);
