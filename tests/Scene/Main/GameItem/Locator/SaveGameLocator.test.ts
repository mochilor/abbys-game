import GameItemCollection from '../../../../../src/Scene/Main/GameItem/GameItemCollection';
import makeSaveGameLocator from '../../../../../src/Scene/Main/GameItem/Locator/SaveGameLocator';
import RoomName from '../../../../../src/Scene/Main/Map/RoomName';
import * as gameStore from '../../../../../src/Service/gameStore';

jest.mock('../../../../../src/Service/gameStore');

const registry = {
  items: {},
  set(name: string, data: any): void {
    this.items[name] = data;
  },
};

const roomName = RoomName.fromName('3_4');

const playerItem = {
  uuid: 'player-uuid',
  id: 1,
  x: 99,
  y: 88,
  key: 'player',
  rotation: 0,
  roomName: RoomName.fromName('3_4'),
  properties: [],
};

const locator = makeSaveGameLocator(registry);

describe('SaveGameLocator', () => {
  test('is an object', () => {
    expect(typeof locator).toBe('object');
  });

  test('will throw an error when no saved game is found', () => {
    jest.spyOn(gameStore, 'loadGame').mockReturnValue(null);

    expect(() => {
      locator.getGameItemCollection(roomName);
    }).toThrowError('No save file!');
  });

  test('will throw an error when we receive a different room', () => {
    const newSavedGame = {
      gameItems: [
        {
          room: {
            x: 2,
            y: 3,
          },
          items: [],
        },
      ],
      playerItem,
      room: {
        x: 2,
        y: 3,
      },
    };
    jest.spyOn(gameStore, 'loadGame').mockReturnValue(newSavedGame);

    expect(() => {
      locator.getGameItemCollection(roomName);
    }).toThrowError('Not current room!');
  });

  test('will return a GameItemCollection and update the registry', () => {
    const gameItemA = {
      uuid: 'aaa-uuid',
      id: 16,
      x: 99,
      y: 88,
      key: 'foo',
      rotation: 90,
      roomName: RoomName.fromName('3_4'),
      properties: [],
    };

    const gameItemB = {
      uuid: 'bbb-uuid',
      id: 8,
      x: 999,
      y: 888,
      key: 'bar',
      rotation: 0,
      roomName: RoomName.fromName('3_4'),
      properties: [],
    };

    const savedGame = {
      gameItems: [
        {
          room: {
            x: 3,
            y: 4,
          },
          items: [gameItemA, gameItemB],
        },
      ],
      playerItem,
      room: {
        x: 3,
        y: 4,
      },
    };

    jest.spyOn(gameStore, 'loadGame').mockReturnValue(savedGame);

    const result = locator.getGameItemCollection(roomName);

    expect(result).toBeInstanceOf(GameItemCollection);

    expect(registry.items).toStrictEqual({
      '3_4': [gameItemA, gameItemB],
    });
  });
});
