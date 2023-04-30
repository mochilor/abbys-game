type Position = {
  x: integer,
  y: integer,
};

export function makeShaker(initialX: integer, initialY: integer): Shaker {
  let isShaking: boolean = false;

  let shakeInterval: integer = 1000;

  let lastShakeAt: number = null;

  function isTimeToShake(time: number) {
    return time - (lastShakeAt ?? 0) > shakeInterval;
  }

  function getNewPositionDelta(): Position {
    function getIncrement(): integer {
      return Math.floor((Math.random() - 0.5) * 4);
    }

    const x = getIncrement() + initialX;
    const y = getIncrement() + initialY;

    return { x, y };
  }

  function shake(time: number): Position {
    if (isShaking) {
      isShaking = false;
      return { x: initialX, y: initialY };
    }

    if (!isTimeToShake(time)) {
      return { x: initialX, y: initialY };
    }

    isShaking = true;
    lastShakeAt = time;
    shakeInterval = Math.max(shakeInterval - 150, 100);

    return getNewPositionDelta();
  }

  return { shake };
}

export type Shaker = {
  shake(time: number): Position,
};
