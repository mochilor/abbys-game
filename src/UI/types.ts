export type Menu = {
  quit(): void,
  addButton(
    buttonBody: Phaser.GameObjects.Rectangle,
    buttonText: Phaser.GameObjects.BitmapText,
  ): void,
  show(): void,
  hide(): void,
  getText(): Phaser.GameObjects.BitmapText,
};

export type Button = {
  enable(): void,
  disable(): void,
  hide(): void,
  show(): void,
  contents(): [Phaser.GameObjects.Rectangle, Phaser.GameObjects.BitmapText],
};
