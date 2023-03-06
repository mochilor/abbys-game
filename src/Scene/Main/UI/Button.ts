export default function createButton(
  x: integer,
  y: integer,
  scene: Phaser.Scene,
  textString: string,
  enabled: boolean,
  callback: CallableFunction,
) {
  const body = scene.add.rectangle(
    x,
    y,
    64,
    17,
  );
  body.setDepth(1);

  const text = scene.add.bitmapText(x, y, 'font', textString)
    .setOrigin(0.5, 0.4)
    .setDepth(2);

  body.setInteractive({ useHandCursor: true });
  body.on('pointerdown', () => callback());

  function enable(): void {
    text.setAlpha(1);
    body.setFillStyle(0x385762);
  }

  function disable(): void {
    text.setAlpha(0.5);
    body.setFillStyle(0x818181);
    body.disableInteractive();
  }

  enable();

  if (!enabled) {
    disable();
  }

  function updatePosition(newX: integer, newY: integer): void {
    body.setX(newX);
    body.setY(newY);
    text.setX(newX);
    text.setY(newY);
  }

  function contents(): [Phaser.GameObjects.Rectangle, Phaser.GameObjects.BitmapText] {
    return [body, text];
  }

  return {
    updatePosition,
    enable,
    disable,
    contents,
  };
}
