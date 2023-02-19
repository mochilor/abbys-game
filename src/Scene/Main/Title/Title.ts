import config from '../../../../config/config.json';
import createButton from '../UI/Button';
import * as EventDispatcher from '../../../Service/EventDispatcher';

export default function createTitle(camera: Phaser.Cameras.Scene2D.Camera, scene: Phaser.Scene) {
  function getPositionFromCamera() {
    return {
      x: camera.scrollX + config.gameWidth / 2,
      y: camera.scrollY + config.gameHeight / 3,
    };
  }

  const body = (() => {
    const position = getPositionFromCamera();

    const rectangle = scene.add.rectangle(
      position.x,
      position.y,
      config.gameWidth * 0.8,
      config.gameHeight * 0.3,
      0x991133,
    );
    rectangle.setDepth(1);

    return rectangle;
  })();

  function start(): void {
    EventDispatcher.emit('gameStarted');
  }

  const buttonOffset = 32;

  const newGameButton = createButton(
    body.x - buttonOffset,
    body.getBottomCenter().y + buttonOffset,
    scene,
    start,
  );

  const continueButton = createButton(
    body.x + buttonOffset,
    body.getBottomCenter().y + buttonOffset,
    scene,
    start,
  );

  let active = true;

  function update(): void {
    if (!active) {
      return;
    }

    const position = getPositionFromCamera();

    body.setX(position.x);
    body.setY(position.y);

    newGameButton.updatePosition(body.x - buttonOffset, body.getBottomCenter().y + buttonOffset);
    continueButton.updatePosition(body.x + buttonOffset, body.getBottomCenter().y + buttonOffset);
  }

  function quit(): void {
    body.destroy();
    newGameButton.destroy();
    continueButton.destroy();
    active = false;
  }

  return { update, quit };
}
