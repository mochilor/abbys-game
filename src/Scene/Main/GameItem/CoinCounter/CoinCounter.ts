import EventDispatcher from '../../../../Service/EventDispatcher';
import RoomName from '../../Map/RoomName';
import CoinsTotal from './CoinsTotal';
import CoinZonesInterface from './CoinZonesCoinZonesInterface';

let instance: CoinCounter = null;

export default class CoinCounter {
  private totals: CoinZonesInterface = {
    cave: 0,
    pyramid: 0,
    base: 0,
  };

  private current: CoinZonesInterface = {
    cave: 0,
    pyramid: 0,
    base: 0,
  };

  private constructor(coinsTotalCollection: CoinsTotal[]) {
    coinsTotalCollection.forEach((element: CoinsTotal) => {
      const roomName = RoomName.fromName(element.room);
      this.totals[roomName.zone()] += element.coins;
    });
  }

  public static init(coinsTotalCollection: CoinsTotal[]): void {
    if (!instance) {
      instance = new CoinCounter(coinsTotalCollection);
    }
  }

  public static reset(): void {
    if (!instance) {
      throw new Error('CoinCounter has not been initialized!');
    }

    instance.current = {
      cave: 0,
      pyramid: 0,
      base: 0,
    };
  }

  public static getInstance(): CoinCounter {
    if (!instance) {
      throw new Error('CoinCounter has not been initialized!');
    }

    return instance;
  }

  public caveTotalCoins(): integer {
    return this.totals.cave;
  }

  public pyramidTotalCoins(): integer {
    return this.totals.pyramid;
  }

  public baseTotalCoins(): integer {
    return this.totals.base;
  }

  public caveCurrentCoins(): integer {
    return this.current.cave;
  }

  public pyramidCurrentCoins(): integer {
    return this.current.pyramid;
  }

  public baseCurrentCoins(): integer {
    return this.current.base;
  }

  public add(roomName: RoomName): void {
    this.current[roomName.zone()] += 1;
    EventDispatcher.getInstance().emit('coinCounterUpdated', this.current);
  }
}
