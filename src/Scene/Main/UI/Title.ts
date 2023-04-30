import config from '../../../../config/config.json';
import createButton from '../../../UI/Button';
import * as EventDispatcher from '../../../Service/EventDispatcher';
import closeUIElement from '../../../UI/ClosingAnimation';
import createMenu from '../../../UI/Menu';
import { Title } from './types';

export default function createTitle(scene: Phaser.Scene, hasSavedGame: boolean): Title {
  const background = (() => {
    const rectangle = scene.add.rectangle(
      0,
      0,
      config.gameWidth,
      config.gameHeight + 10,
      0x000000,
      0.75,
    );
    rectangle.setOrigin(0, 0);
    rectangle.setDepth(1);
    rectangle.setScrollFactor(0);

    return rectangle;
  })();

  const logo = (() => {
    const position = {
      x: background.x + config.gameWidth / 2,
      y: background.x + config.gameHeight / 3,
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

  const buttonOffsetX = 42;
  const buttonOffsetY = 22;

  const newGameButton = createButton(
    logo.x - buttonOffsetX,
    logo.getBottomCenter().y + buttonOffsetY,
    scene,
    'New game',
    true,
    newGame,
  );

  const continueButton = createButton(
    logo.x + buttonOffsetX,
    logo.getBottomCenter().y + buttonOffsetY,
    scene,
    'Continue',
    hasSavedGame,
    continueGame,
  );

  const alertMenu = createMenu(
    logo.getBottomCenter().x,
    logo.getBottomCenter().y + buttonOffsetY,
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

  return {
    quit,
    showAlertText,
    hideAlertText,
  };
}
