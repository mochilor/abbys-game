import config from '../../../../config/config.json';
import closeUIElement from './ClosingAnimation';

export default function createMenu(
  x: integer,
  y: integer,
  scene: Phaser.Scene,
  textString: string,
) {
  const text = scene.add.bitmapText(x, y, 'font', textString)
    .setOrigin(0.5, 0.4)
    .setDepth(2)
    .setMaxWidth(config.gameWidth * 0.8);

  const buttonBodys = [];
  const buttonTexts = [];

  function addButton(
    buttonBody: Phaser.GameObjects.Rectangle,
    buttonText: Phaser.GameObjects.BitmapText,
  ): void {
    buttonBodys.push(buttonBody);
    buttonTexts.push(buttonText);

    const buttonY = text.y + text.height * 1.5;
    buttonBody.setY(buttonY);
    buttonText.setY(buttonY);

    if (buttonBodys.length === 1) {
      const buttonX = text.x;
      buttonBody.setX(buttonX);
      buttonText.setX(buttonX);
    }

    if (buttonBodys.length === 2) {
      const buttonOffsetX = 42;
      const x0 = text.x - buttonOffsetX;
      const x1 = text.x + buttonOffsetX;
      buttonBodys[0].setX(x0);
      buttonTexts[0].setX(x0);
      buttonBodys[1].setX(x1);
      buttonTexts[1].setX(x1);
    }
  }

  function quit(): void {
    closeUIElement(scene, [text, ...buttonBodys, ...buttonTexts]);
  }

  return { quit, addButton };
}
