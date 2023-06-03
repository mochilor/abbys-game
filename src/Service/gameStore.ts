import RoomName from '../Scene/Main/Map/RoomName';
import { roomNames } from './mapStore';
import { GameItemCollection, GameItem } from '../Scene/Main/GameItem/types';
import { SavedGame, Settings } from './types';

const gameFileName = 'cavegame.savefile';
const settingsFileName = 'cavegame.settings';

function loadGame(): SavedGame | null {
  const saveFile = localStorage.getItem(gameFileName);

  if (saveFile === null) {
    return null;
  }

  const parsedSaveFile = JSON.parse(saveFile);

  return parsedSaveFile;
}

function hasSavedGame(): boolean {
  return loadGame() !== null;
}

function saveGame(
  gameItemCollection: GameItemCollection,
  playerItem: GameItem,
  roomName: RoomName,
  sceneRegistry: Phaser.Data.DataManager,
): void {
  const dataToSave = {
    gameItems: [{
      room: {
        x: roomName.getX(),
        y: roomName.getY(),
      },
      items: gameItemCollection.getItems(),
    }],
    playerItem,
    room: {
      x: roomName.getX(),
      y: roomName.getY(),
    },
  };

  // Update each other room with the last data in memory before saving:
  roomNames().forEach((name: string) => {
    const inMemoryGameItems: GameItem[] = sceneRegistry.get(name);
    if (inMemoryGameItems != null) {
      const inMemoryRoom = RoomName.fromName(name);
      if (!roomName.isSameRoom(inMemoryRoom)) {
        dataToSave.gameItems.push({
          room: {
            x: inMemoryRoom.getX(),
            y: inMemoryRoom.getY(),
          },
          items: inMemoryGameItems,
        });
      }
    }
  });

  localStorage.setItem(gameFileName, JSON.stringify(dataToSave));
}

function resetGame(): void {
  localStorage.clear();
}

function saveSettings(settings: Settings): void {
  localStorage.setItem(settingsFileName, JSON.stringify(settings));
}

function loadSettings(): Settings | null {
  const saveFile = localStorage.getItem(settingsFileName);

  if (saveFile === null) {
    return null;
  }

  const parsedSaveFile = JSON.parse(saveFile);

  return parsedSaveFile;
}

export {
  saveGame,
  hasSavedGame,
  loadGame,
  resetGame,
  saveSettings,
  loadSettings,
};
