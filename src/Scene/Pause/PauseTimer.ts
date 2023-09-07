import { PauseTimeCounter } from './types';

let init: boolean = null;

export default function makePauseTimer(scene: Phaser.Scene): PauseTimeCounter {
  let lastTime: number = 0;

  let pausedAt: number = 0;

  let gameResumed: boolean = false;

  let pauseTime: number = 0;

  function paused(): void {
    pausedAt = lastTime;
  }

  function resumed(): void {
    gameResumed = true;
  }

  if (!init) {
    scene.events.on('pause', paused);
    scene.events.on('resume', resumed);
    init = true;
  }

  return {
    calculatePauseTime(realTime: integer): integer {
      lastTime = realTime;

      if (gameResumed) {
        pauseTime += realTime - pausedAt;
        pausedAt = 0;
        gameResumed = false;
      }

      // We need to substract any time spent on pause menu ot prevent weird behaviors in some
      // Sprites that use time, like SpikePlatform
      return pauseTime;
    },
  };
}
