import { Button } from './types';

export default function createButton(
  x: integer,
  y: integer,
  scene: Phaser.Scene,
  textString: string,
  enabled: boolean,
  callback: CallableFunction,
  width: integer = 64,
): Button {
  const body = scene.add.rectangle(
    x,
    y,
    width,
    16,
  );
  body.setDepth(1);
  body.setScrollFactor(0);

  const enabledColor = 0x385762;
  const disabledColor = 0x818181;

  const text = scene.add.bitmapText(x, y, 'font', textString)
    .setOrigin(0.5, 0.4)
    .setDepth(2)
    .setScrollFactor(0);

  body.setInteractive({ useHandCursor: true });
  body.on('pointerdown', () => callback.apply(scene, []));

  function enable(): void {
    text.setVisible(true);
    text.setAlpha(1);
    body.setVisible(true);
    body.setFillStyle(enabledColor);
  }

  function disable(): void {
    text.setAlpha(0.5);
    body.setFillStyle(disabledColor);
    body.disableInteractive();
  }

  function hide(): void {
    body.disableInteractive();
    text.setVisible(false);
    body.setVisible(false);
  }

  function show(): void {
    text.setVisible(true);
    body.setInteractive();
    body.setVisible(true);
  }

  enable();

  if (!enabled) {
    disable();
  }

  function contents(): [Phaser.GameObjects.Rectangle, Phaser.GameObjects.BitmapText] {
    return [body, text];
  }

  return {
    enable,
    disable,
    hide,
    show,
    contents,
  };
}
