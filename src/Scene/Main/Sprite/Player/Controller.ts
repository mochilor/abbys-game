import Phaser from 'phaser';

export interface PlayerDirections {
  directionX: number,
  directionY: number,
}

export class Controller {
  private leftKey: Phaser.Input.Keyboard.Key;

  private rightKey: Phaser.Input.Keyboard.Key;

  private upKey: Phaser.Input.Keyboard.Key;

  constructor(
    leftKey: Phaser.Input.Keyboard.Key,
    rightKey: Phaser.Input.Keyboard.Key,
    upKey: Phaser.Input.Keyboard.Key,
  ) {
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.upKey = upKey;
  }

  public move(): PlayerDirections {
    let directionX: number = 0;
    let directionY: number = 0;

    if (this.leftKey.isDown) {
      directionX -= 1;
    }

    if (this.rightKey.isDown) {
      directionX += 1;
    }

    if (this.upKey.isDown) {
      directionY -= 1;
    }

    return { directionX, directionY };
  }

  public leftKeyIsDown(): boolean {
    return this.leftKey.isDown;
  }

  public rightKeyIsDown(): boolean {
    return this.rightKey.isDown;
  }
}
