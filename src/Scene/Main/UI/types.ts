export type Menu = {
  quit(): void,
  addButton(
    buttonBody: Phaser.GameObjects.Rectangle,
    buttonText: Phaser.GameObjects.BitmapText,
  ): void,
  show(): void,
  hide(): void,
};
