import GameItemCollection from '../../../../../src/Scene/Main/GameItem/GameItemCollection';
import GameItem from '../../../../../src/Scene/Main/GameItem/GameItemInterface';
import makeInMemoryLocator from '../../../../../src/Scene/Main/GameItem/Locator/InMemoryLocator';
import RoomName from '../../../../../src/Scene/Main/Map/RoomName';

const registry = {
  gameItems: {},
  get(name: string): GameItem[] | null | undefined {
    return this.gameItems[name];
  },
};

beforeEach(() => {
  registry.gameItems = {};
});

const roomName = RoomName.fromName('1_1');

const gameItem = {
  uuid: '',
  id: 16,
  x: 1,
  y: 1,
  key: 'dummy',
  rotation: 90,
  roomName: { x: 1, y: 1 },
  properties: [],
};

const locator = makeInMemoryLocator(registry);

describe('InMemoryLocator', () => {
  test('is an object', () => {
    expect(typeof locator).toBe('object');
  });

  test('throws an Error when a non existing entry is requested', () => {
    expect(() => {
      locator.getGameItemCollection(roomName);
    }).toThrowError('No data in memory');
  });

  test('throws an Error when the requested entry is null', () => {
    registry.gameItems['1_1'] = null;

    expect(() => {
      locator.getGameItemCollection(roomName);
    }).toThrowError('No data in memory');
  });

  test('returns a GameItemCollection when the requested entry exists', () => {
    registry.gameItems['1_1'] = [gameItem];

    const result = locator.getGameItemCollection(roomName);

    expect(result).toBeInstanceOf(GameItemCollection);
  });

  test('The returned GameItemCollection contains a RoomName instance', () => {
    registry.gameItems['1_1'] = [gameItem];

    const result = locator.getGameItemCollection(roomName);
    const returnedGameItem = result.getItems()[0];

    expect(returnedGameItem.roomName.getName()).toBe('1_1');
  });
});
