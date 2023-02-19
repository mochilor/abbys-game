import GameItem from '../../../../src/Scene/Main/GameItem/GameItemInterface';
import makeInMemoryLocator from '../../../../src/Scene/Main/GameItem/Locator/InMemoryLocator';
import RoomName from '../../../../src/Scene/Main/Map/RoomName';

const registry = {
  gameItems: [],
  get(name: string): GameItem[] | null {
    return this.gameItems[name] ?? null;
  },
};

const roomName = RoomName.fromName('1_1');

const locator = makeInMemoryLocator(registry);

describe('InMemoryLocator', () => {
  test('is an object', () => {
    expect(typeof locator).toBe('object');
  });

  test('throws an Error when there is no stored data', () => {
    expect(() => {
      locator.getGameItemCollection(roomName);
    }).toThrowError('No data in memory');
  });
});
