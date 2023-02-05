export default function createButton(
  x: integer,
  y: integer,
  scene: Phaser.Scene,
  callback: CallableFunction,
) {
  const body = scene.add.rectangle(
    x,
    y,
    48,
    16,
    0x991133,
  );
  body.setDepth(1);

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
  }

  function destroy(): void {
    body.destroy();
  }

  return { updatePosition, destroy };
}
