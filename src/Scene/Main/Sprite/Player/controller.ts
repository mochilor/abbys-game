import Phaser from 'phaser';

interface Controller {
  move(): integer,
  leftKeyIsDown(): boolean,
  rightKeyIsDown(): boolean,
}

function createController(
  leftKey: Phaser.Input.Keyboard.Key,
  rightKey: Phaser.Input.Keyboard.Key,
): Controller {
  function move(): integer {
    let direction: number = 0;

    if (leftKey.isDown) {
      direction -= 1;
    }

    if (rightKey.isDown) {
      direction += 1;
    }

    return direction;
  }

  function leftKeyIsDown(): boolean {
    return leftKey.isDown;
  }

  function rightKeyIsDown(): boolean {
    return rightKey.isDown;
  }

  return { move, leftKeyIsDown, rightKeyIsDown };
}

export { Controller, createController };
