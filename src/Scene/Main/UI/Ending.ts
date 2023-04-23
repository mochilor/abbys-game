import config from '../../../../config/config.json';
import { Ending } from './types';

export default function createEnding(
  camera: Phaser.Cameras.Scene2D.Camera,
  scene: Phaser.Scene,
): Ending {
  const background = (() => {
    const rectangle = scene.add.rectangle(
      camera.scrollX,
      camera.scrollY,
      config.gameWidth,
      config.gameHeight + 10,
      0x000000,
      1,
    );
    rectangle.setOrigin(0, 0);
    rectangle.setDepth(1);
    rectangle.setScrollFactor(0);
    rectangle.setVisible(false);
    rectangle.setAlpha(0);

    return rectangle;
  })();

  const tween = scene.tweens.add({
    props: {
      alpha: 1,
    },
    targets: background,
    duration: 2000,
    loop: 0,
    ease: 'linear',
    paused: true,
    delay: 1000,
  });

  function start(): void {
    background.setVisible(true);
    tween.play();
  }

  return { start };
}
