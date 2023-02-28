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

  const buttonOffsetX = 40;
  const buttonOffsety = 24;

  const newGameButton = createButton(
    body.x - buttonOffsetX,
    body.getBottomCenter().y + buttonOffsety,
    scene,
    'New game',
    start,
  );

  const continueButton = createButton(
    body.x + buttonOffsetX,
    body.getBottomCenter().y + buttonOffsety,
    scene,
    'Continue',
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
    background.setX(camera.scrollX);
    background.setY(camera.scrollY);

    newGameButton.updatePosition(body.x - buttonOffsetX, body.getBottomCenter().y + buttonOffsety);
    continueButton.updatePosition(body.x + buttonOffsetX, body.getBottomCenter().y + buttonOffsety);
  }

  function quit(): void {
    scene.tweens.add({
      targets: [
        body,
        newGameButton.body,
        newGameButton.text,
        continueButton.body,
        continueButton.text,
        background,
      ],
      duration: 300,
      ease: 'linear',
      props: {
        y: '-=10',
        alpha: 0,
      },
      onComplete: () => {
        body.destroy();
        newGameButton.destroy();
        continueButton.destroy();
      },
    });

    active = false;
  }

  return { update, quit };
}
