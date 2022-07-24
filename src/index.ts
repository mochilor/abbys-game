import Phaser from 'phaser';
import Main from './Scene/Main/Main';

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 256,
  transparent: false,
  backgroundColor: '#000000',
  render: {
    pixelArt: true,
  },
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
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
