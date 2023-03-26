import RoomName from '../Scene/Main/Map/RoomName';
import SavedGame from './SavedGame';
import { roomNames } from './mapStore';
import { GameItemCollection, GameItem } from '../Scene/Main/GameItem/types';
import { getSettings } from './Settings';

const fileName = 'cavegame.savefile';

function loadGame(): SavedGame | null {
  const saveFile = localStorage.getItem(fileName);

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
    settings: {
      audio: getSettings().audio,
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

  localStorage.setItem(fileName, JSON.stringify(dataToSave));
}

function resetGame(): void {
  localStorage.clear();
}

export {
  saveGame,
  hasSavedGame,
  loadGame,
  resetGame,
};
