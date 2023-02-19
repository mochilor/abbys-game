import GameItemLocator from '../GameItemLocatorInterface';
import MapGameItemLocator from '../MapGameItemLocatorInterface';
import makeInMemory from './InMemoryLocator';
import makeMap from './MapLocator';
import makeSaveGame from './SaveGameLocator';

export function makeInMemoryGameLocator(sceneRegistry: Phaser.Data.DataManager): GameItemLocator {
  return makeInMemory(sceneRegistry);
}

export function makeMapLocator(map: Phaser.Tilemaps.Tilemap): GameItemLocator & MapGameItemLocator {
  return makeMap(map);
}

export function makeSaveGameLocator(sceneRegistry: Phaser.Data.DataManager): GameItemLocator {
  return makeSaveGame(sceneRegistry);
}
