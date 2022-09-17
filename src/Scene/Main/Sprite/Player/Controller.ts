import Phaser from 'phaser';

export interface PlayerVelocity {
  velocityX: number,
  velocityY: number,
}

export class Controller {
  private leftKey: Phaser.Input.Keyboard.Key;

  private rightKey: Phaser.Input.Keyboard.Key;

  private upKey: Phaser.Input.Keyboard.Key;

  private canJump: boolean = true;

  constructor(
    leftKey: Phaser.Input.Keyboard.Key,
    rightKey: Phaser.Input.Keyboard.Key,
    upKey: Phaser.Input.Keyboard.Key,
  ) {
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.upKey = upKey;
  }

  move(): PlayerVelocity {
    let velocityX: number = 0;
    let velocityY: number = 0;

    if (this.leftKey.isDown) {
      velocityX -= 1;
    }

    if (this.rightKey.isDown) {
      velocityX += 1;
    }

    if (this.upKey.isUp) {
      this.canJump = true;
    }

    if (this.upKey.isDown && this.canJump) {
      velocityY -= 1;
      this.canJump = false;
    }

    return { velocityX, velocityY };
  }
}
