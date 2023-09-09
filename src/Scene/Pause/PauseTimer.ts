import { PauseTimeCounter } from './types';

const timer = {
  init: false,
  lastTime: 0,
  pausedAt: 0,
  gameResumed: false,
  pauseTime: 0,

  paused(): void {
    this.pausedAt = this.lastTime;
  },

  resumed(): void {
    this.gameResumed = true;
  },

  reset(): void {
    this.lastTime = 0;
    this.pausedAt = 0;
    this.gameResumed = false;
    this.pauseTime = 0;
    this.init = true;
  },
};

export default function makePauseTimer(scene: Phaser.Scene): PauseTimeCounter {
  // We need to use a static object for the callback and values, otherwise the listener being
  // created in a room is still in memory but not accesible.
  if (!timer.init) {
    scene.events.on('pause', timer.paused, timer);
    scene.events.on('resume', timer.resumed, timer);
    timer.init = true;
  }

  timer.reset();

  // This function calculates the time spent on pause menu to prevent weird behaviors in some
  // Sprites that use time, like SpikePlatform
  function calculatePauseTime(realTime: integer): integer {
    timer.lastTime = realTime;

    if (timer.gameResumed) {
      timer.pauseTime += realTime - timer.pausedAt;
      timer.pausedAt = 0;
      timer.gameResumed = false;
    }

    return timer.pauseTime;
  }

  return {
    calculatePauseTime,
  };
}
