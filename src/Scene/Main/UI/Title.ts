import config from '../../../../config/config.json';
import createButton from '../../../UI/Button';
import * as EventDispatcher from '../../../Service/EventDispatcher';
import closeUIElement from '../../../UI/ClosingAnimation';
import createMenu from '../../../UI/Menu';
import { Title } from './types';

export default function createTitle(scene: Phaser.Scene, hasSavedGame: boolean): Title {
  let initialized: boolean = false;

  const background = (() => {
    const rectangle = scene.add.rectangle(
      0,
      0,
      config.gameWidth,
      config.gameHeight + 10,
      0x000000,
      1,
    );
    rectangle.setOrigin(0, 0);
    rectangle.setDepth(1);
    rectangle.setScrollFactor(0);

    return rectangle;
  })();

  const logo = (() => {
    const position = {
      x: config.gameWidth / 2,
      y: (config.gameHeight / 2) - 8,
    };

    const image = scene.add.image(
      position.x,
      position.y,
      'titleImage',
    );
    image.setDepth(1);
    image.setScrollFactor(0);

    return image;
  })();

  function newGame(): void {
    EventDispatcher.emit('newGameButtonPressed');
  }

  function confirm(): void {
    EventDispatcher.emit('confirmButtonPressed');
  }

  function cancel(): void {
    EventDispatcher.emit('cancelButtonPressed');
  }

  function continueGame(): void {
    EventDispatcher.emit('continueButtonPressed');
  }

  const baseButtonX = (config.gameWidth / 2);
  const baseButtonY = (config.gameHeight / 2);
  const buttonOffsetX = 42;
  const buttonOffsetY = 22;

  const newGameButton = createButton(
    baseButtonX - buttonOffsetX,
    baseButtonY + buttonOffsetY,
    scene,
    'New game',
    true,
    newGame,
  );

  const continueButton = createButton(
    baseButtonX + buttonOffsetX,
    baseButtonY + buttonOffsetY,
    scene,
    'Continue',
    hasSavedGame,
    continueGame,
  );

  const alertMenu = createMenu(
    baseButtonX,
    baseButtonY + buttonOffsetY,
    scene,
    'Are you sure?\nYour previous game will be lost!',
  );

  const confirmButton = createButton(
    0,
    0,
    scene,
    'Confirm',
    true,
    confirm,
  );

  const cancelButton = createButton(
    0,
    0,
    scene,
    'Cancel',
    true,
    cancel,
  );

  newGameButton.hide();
  continueButton.hide();

  alertMenu.addButton(...confirmButton.contents());
  alertMenu.addButton(...cancelButton.contents());

  function quit(): void {
    closeUIElement(
      scene,
      [
        logo,
        ...newGameButton.contents(),
        ...continueButton.contents(),
        background,
      ],
    );
  }

  const versionText = process.env.VERSION ?? 'DEV';

  const version = scene.add.bitmapText(
    config.gameWidth - 32,
    config.gameHeight - 16,
    'smallFont',
    versionText,
  )
    .setDepth(2)
    .setScrollFactor(0)
    .setAlpha(0.4);

  function showAlertText(): void {
    newGameButton.hide();
    continueButton.hide();
    alertMenu.show();
  }

  function hideAlertText(): void {
    newGameButton.show();
    continueButton.show();
    alertMenu.hide();
  }

  function init(): void {
    if (initialized) {
      return;
    }

    version.setVisible(false);

    initialized = true;

    scene.tweens.add({
      targets: logo,
      duration: 300,
      ease: 'linear',
      props: {
        y: config.gameHeight / 3,
      },
      onComplete: () => {
        newGameButton.show();
        continueButton.show();
      },
    });

    scene.tweens.add({
      targets: background,
      duration: 300,
      ease: 'linear',
      props: {
        alpha: 0.8,
      },
    });
  }

  return {
    quit,
    showAlertText,
    hideAlertText,
    init,
  };
}
