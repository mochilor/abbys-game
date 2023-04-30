import config from '../../../../config/config.json';
import { Ending } from './types';
import createMenu from '../../../UI/Menu';
import * as EventDispatcher from '../../../Service/EventDispatcher';
import closeUIElement from '../../../UI/ClosingAnimation';

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

  const { x } = background.getCenter();
  const y = background.getCenter().y - 64;

  const congratulations = createMenu(
    x,
    y,
    scene,
    'Congratulations!\nYou found the legendary treasure',
  );

  const secondaryText = createMenu(
    x,
    y + 32,
    scene,
    'Now is time to go home',
  );

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

  function renderSecondaryText(): void {
    secondaryText.show();
  }

  function textIsComplete(): void {
    EventDispatcher.emit('endingText1Complete');
  }

  function renderText(): void {
    congratulations.show();

    scene.time.delayedCall(3000, renderSecondaryText);
    scene.time.delayedCall(5000, textIsComplete);
  }

  function hide(): void {
    closeUIElement(
      scene,
      [
        background,
        congratulations.getText(),
        secondaryText.getText(),
      ],
    );
  }

  return { start, renderText, hide };
}
