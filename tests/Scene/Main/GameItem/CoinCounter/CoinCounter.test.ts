import * as CoinCounter from '../../../../../src/Scene/Main/GameItem/CoinCounter/CoinCounter';
import RoomName from '../../../../../src/Scene/Main/Map/RoomName';

jest.mock('../../../../../src/Service/EventDispatcher');

describe('CoinCounter', () => {
  test('throws an Exception when it has not been initialized yet', () => {
    expect(() => {
      CoinCounter.getInstance();
    }).toThrowError('CoinCounter has not been initialized!');
  });

  test('throws an Exception when is reset before it has been initialized', () => {
    expect(() => {
      CoinCounter.reset();
    }).toThrowError('CoinCounter has not been initialized!');
  });

  test('can be used to count coins', () => {
    const coinsTotalCollection = [
      {
        room: '1_1',
        coins: 1,
      },
      {
        room: '3_3',
        coins: 5,
      },
      {
        room: '5_5',
        coins: 2,
      },
      {
        room: '3_6',
        coins: 2,
      },
      {
        room: '4_7',
        coins: 1,
      },
      {
        room: '1_9',
        coins: 9,
      },
    ];

    CoinCounter.init(coinsTotalCollection);
    const instance = CoinCounter.getInstance();

    expect(instance.caveTotalCoins()).toBe(6);
    expect(instance.pyramidTotalCoins()).toBe(4);
    expect(instance.baseTotalCoins()).toBe(10);

    expect(instance.caveCurrentCoins()).toBe(0);
    expect(instance.pyramidCurrentCoins()).toBe(0);
    expect(instance.baseCurrentCoins()).toBe(0);

    instance.add(RoomName.fromName('1_1'));
    instance.add(RoomName.fromName('3_3'));
    instance.add(RoomName.fromName('3_3'));
    instance.add(RoomName.fromName('4_4'));
    instance.add(RoomName.fromName('4_5'));
    instance.add(RoomName.fromName('4_5'));
    instance.add(RoomName.fromName('4_5'));
    instance.add(RoomName.fromName('6_6'));
    instance.add(RoomName.fromName('7_7'));
    instance.add(RoomName.fromName('1_8'));
    instance.add(RoomName.fromName('10_9'));

    expect(instance.caveCurrentCoins()).toBe(4);
    expect(instance.pyramidCurrentCoins()).toBe(4);
    expect(instance.baseCurrentCoins()).toBe(3);

    CoinCounter.reset();

    expect(instance.caveCurrentCoins()).toBe(0);
    expect(instance.pyramidCurrentCoins()).toBe(0);
    expect(instance.baseCurrentCoins()).toBe(0);
  });
});
