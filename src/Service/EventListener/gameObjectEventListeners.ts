import Door from '../../Scene/Main/Sprite/Collidable/Dynamic/Door';
import Platform from '../../Scene/Main/Sprite/Collidable/Static/Platform';
import Counter from '../../Scene/Main/Sprite/Decoration/Counter';
import * as EventDispatcher from '../EventDispatcher';

export default function listenGameObjectEvents(doors: Door[], platforms: Platform[]): void {
  const completeCounters: string[] = [];

  function unlock(): void {
    doors.forEach((door: Door) => {
      door.unlock();
    });
  }

  // This event activates a platform that is not moving. It should be the only elegible platform:
  function onCoinCounterComplete(counter: Counter): void {
    if (completeCounters.includes(counter.getLevel())) {
      return;
    }

    completeCounters.push(counter.getLevel());
    if (completeCounters.length < 3) {
      return;
    }

    platforms.forEach((element: Platform) => element.unblock());
  }

  EventDispatcher.on('playerGotCoin', unlock);
  EventDispatcher.on('coinCounterComplete', onCoinCounterComplete);
}
