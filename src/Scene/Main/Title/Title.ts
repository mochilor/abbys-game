import config from '../../../../config/config.json';
import createButton from '../UI/Button';
import * as EventDispatcher from '../../../Service/EventDispatcher';
import closeUIElement from '../UI/ClosingAnimation';
import createMenu from '../UI/Menu';

export default function createTitle(
  camera: Phaser.Cameras.Scene2D.Camera,
  scene: Phaser.Scene,
  hasSavedGame: boolean,
) {
  function getPositionFromCamera() {
    return {
      x: camera.scrollX + config.gameWidth / 2,
      y: camera.scrollY + config.gameHeight / 3,
    };
  }

  const background = (() => {
    const rectangle = scene.add.rectangle(
      camera.scrollX,
      camera.scrollY,
      config.gameWidth,
      config.gameHeight + 10,
      0x000000,
      0.75,
    );
    rectangle.setOrigin(0, 0);
    rectangle.setDepth(1);

    return rectangle;
  })();

  const logo = (() => {
    const position = getPositionFromCamera();

    const image = scene.add.image(
      position.x,
      position.y,
      'titleImage',
    );
    image.setDepth(1);

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

  let active = true;

  function update(): void {
    if (!active) {
      return;
    }

    const position = getPositionFromCamera();

    logo.setX(position.x);
    logo.setY(position.y);
    background.setX(camera.scrollX);
    background.setY(camera.scrollY);

    newGameButton.updatePosition(logo.x - buttonOffsetX, logo.getBottomCenter().y + buttonOffsetY);
    continueButton.updatePosition(logo.x + buttonOffsetX, logo.getBottomCenter().y + buttonOffsetY);
  }

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

    active = false;
  }

  function showAlertText(): void {
    const menu = createMenu(
      logo.getBottomCenter().x,
      logo.getBottomCenter().y + (buttonOffsetY * 2.5),
      scene,
      'Are you sure? Your previous game will be lost',
    );

    newGameButton.disable();
    continueButton.disable();

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

    menu.addButton(...confirmButton.contents());
    menu.addButton(...cancelButton.contents());
  }

  return { update, quit, showAlertText };
}
