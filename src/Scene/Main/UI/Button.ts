export default function createButton(
  x: integer,
  y: integer,
  scene: Phaser.Scene,
  textString: string,
  callback: CallableFunction,
) {
  const body = scene.add.rectangle(
    x,
    y,
    64,
    16,
    0x991133,
  );
  body.setDepth(1);

  const text = scene.add.bitmapText(x, y, 'font', textString)
    .setOrigin(0.5, 0.4)
    .setDepth(2);

  const active = true;

  body.setInteractive({ useHandCursor: true });
  body.on('pointerdown', () => {
    if (!active) {
      return;
    }

    callback();
  });

  function updatePosition(newX: integer, newY: integer): void {
    body.setX(newX);
    body.setY(newY);
    text.setX(newX);
    text.setY(newY);
  }

  function destroy(): void {
    body.destroy();
    text.destroy();
  }

  return {
    updatePosition,
    destroy,
    body,
    text,
  };
}
