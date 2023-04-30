import config from '../../../../config/config.json';
import { Ending } from './types';
import createMenu from '../../../UI/Menu';
import { Menu } from '../../../UI/types';

export default function createEnding(scene: Phaser.Scene): Ending {
  const background = (() => {
    const rectangle = scene.add.rectangle(
      0,
      0,
      config.gameWidth,
      config.gameHeight,
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

  function renderSecondaryText(x: integer, y: integer): void {
    const secondaryText = createMenu(
      x,
      y + 24,
      scene,
      'Now try again and find the REAL treasure',
    );
    secondaryText.show();
  }

  function renderText(): void {
    const { x } = background.getCenter();
    const y = background.getCenter().y - 64;
    const congratulations = createMenu(
      x,
      y,
      scene,
      'Congratulations!',
    );
    congratulations.show();

    scene.time.delayedCall(3000, renderSecondaryText, [x, y]);
  }

  return { start, renderText };
}
