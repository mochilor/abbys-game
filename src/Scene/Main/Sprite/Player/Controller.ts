import Phaser from 'phaser';

export default class Controller {
  private leftKey: Phaser.Input.Keyboard.Key;

  private rightKey: Phaser.Input.Keyboard.Key;

  constructor(
    leftKey: Phaser.Input.Keyboard.Key,
    rightKey: Phaser.Input.Keyboard.Key,
  ) {
    this.leftKey = leftKey;
    this.rightKey = rightKey;
  }

  public move(): number {
    let direction: number = 0;

    if (this.leftKey.isDown) {
      direction -= 1;
    }

    if (this.rightKey.isDown) {
      direction += 1;
    }

    return direction;
  }

  public leftKeyIsDown(): boolean {
    return this.leftKey.isDown;
  }

  public rightKeyIsDown(): boolean {
    return this.rightKey.isDown;
  }
}
