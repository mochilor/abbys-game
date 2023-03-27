import * as EventDispatcher from '../../../../Service/EventDispatcher';
import RoomName from '../../Map/RoomName';
import { CoinCounter, CoinZones, CoinsTotal } from './types';

let instance: CoinCounter = null;

const totals: CoinZones = {
  cave: 0,
  pyramid: 0,
  base: 0,
};

let current: CoinZones = {
  cave: 0,
  pyramid: 0,
  base: 0,
};

export function getInstance(): CoinCounter {
  if (!instance) {
    throw new Error('CoinCounter has not been initialized!');
  }

  return instance;
}

export function reset(): void {
  if (!instance) {
    throw new Error('CoinCounter has not been initialized!');
  }

  current = {
    cave: 0,
    pyramid: 0,
    base: 0,
  };
}

export function init(coinsTotalCollection: CoinsTotal[]) {
  if (instance) {
    return;
  }

  instance = (() => {
    coinsTotalCollection.forEach((element: CoinsTotal) => {
      const roomName = RoomName.fromName(element.room);
      totals[roomName.zone()] += element.coins;
    });

    function add(roomName: RoomName): void {
      current[roomName.zone()] += 1;
      EventDispatcher.emit('coinCounterUpdated', current);
    }

    function getTotalByLevel(level: string): integer {
      return totals[level] ?? 0;
    }

    function getCurrentByLevel(level: string): integer {
      return current[level] ?? 0;
    }

    function getRemainingByLevel(level: string): integer {
      return getTotalByLevel(level) - getCurrentByLevel(level);
    }

    return {
      add,
      getTotalByLevel,
      getCurrentByLevel,
      getRemainingByLevel,
    };
  })();
}
