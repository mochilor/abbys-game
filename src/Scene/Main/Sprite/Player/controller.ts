type Key = {
  isDown: boolean,
};

type Controller = {
  move(): integer,
};

function createController(leftKey: Key, rightKey: Key): Controller {
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

  return { move };
}

export { Controller, createController };
