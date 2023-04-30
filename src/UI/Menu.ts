import config from '../../config/config.json';
import closeUIElement from './ClosingAnimation';
import { Menu } from './types';

export default function create(
  x: integer,
  y: integer,
  scene: Phaser.Scene,
  textString: string,
): Menu {
  const text = scene.add.bitmapText(x, y, 'font', textString)
    .setOrigin(0.5, 0.4)
    .setDepth(2)
    .setCenterAlign()
    .setMaxWidth(config.gameWidth * 0.8)
    .setScrollFactor(0)
    .setVisible(false);

  const buttonBodys = [];
  const buttonTexts = [];

  function addButton(
    buttonBody: Phaser.GameObjects.Rectangle,
    buttonText: Phaser.GameObjects.BitmapText,
  ): void {
    buttonBodys.push(buttonBody);
    buttonTexts.push(buttonText);

    const buttonY = text.y + text.height * 1.5;

    buttonBody.setVisible(false)
      .setScrollFactor(0)
      .setY(buttonY);
    buttonText.setVisible(false)
      .setScrollFactor(0)
      .setY(buttonY);

    if (buttonBodys.length === 1) {
      const buttonX = text.x;
      buttonBody.setX(buttonX);
      buttonText.setX(buttonX);
      return;
    }

    if (buttonBodys.length === 2) {
      const buttonOffsetX = 42;
      const x0 = text.x - buttonOffsetX;
      const x1 = text.x + buttonOffsetX;
      buttonBodys[0].setX(x0);
      buttonTexts[0].setX(x0);
      buttonBodys[1].setX(x1);
      buttonTexts[1].setX(x1);
      return;
    }

    const offset = 24;
    let currentY = y + offset;

    for (let n = 0; n < buttonBodys.length; n += 1) {
      buttonBodys[n].setX(x);
      buttonBodys[n].setY(currentY);
      buttonTexts[n].setX(x);
      buttonTexts[n].setY(currentY);
      currentY += offset;
    }
  }

  function show(): void {
    text.setVisible(true);
    buttonBodys.forEach((element: Phaser.GameObjects.Rectangle) => element.setVisible(true));
    buttonTexts.forEach((element: Phaser.GameObjects.BitmapText) => element.setVisible(true));
  }

  function hide(): void {
    text.setVisible(false);
    buttonBodys.forEach((element: Phaser.GameObjects.Rectangle) => element.setVisible(false));
    buttonTexts.forEach((element: Phaser.GameObjects.BitmapText) => element.setVisible(false));
  }

  function quit(): void {
    closeUIElement(scene, [text, ...buttonBodys, ...buttonTexts]);
  }

  function getText(): Phaser.GameObjects.BitmapText {
    return text;
  }

  return {
    quit,
    addButton,
    show,
    hide,
    getText,
  };
}
