import EventDispatcher from '../../../../Service/EventDispatcher';
import GameItem from '../../GameItem/GameItemInterface';
import MapEventsGameItemCollection from '../../GameItem/MapEventsGameItemCollection';
import Player from '../Player/Player';
import Platform from './Platform';

let gameScene: Phaser.Scene;

let eventGameItemCollection: MapEventsGameItemCollection;

let playerSprite: Player;

function removeWalls(eventGameItems: GameItem[]): void {
  let tileStart: GameItem = null;
  let tileEnd: GameItem = null;

  eventGameItems.forEach((item: GameItem) => {
    if (item.properties[0].value === 'tileStart') {
      tileStart = item;
    }

    if (item.properties[0].value === 'tileEnd') {
      tileEnd = item;
    }
  });

  if (tileStart === null || tileEnd === null) {
    // We are not in the right room
    return;
  }

  const tileMap: Phaser.Tilemaps.Tilemap = gameScene.children.getFirst('type', 'TilemapLayer');
  const tileSet = tileMap.tileset[0];

  const areaWidthX = tileEnd.x - tileStart.x + tileSet.tileWidth;
  const areaWidthY = tileEnd.y - tileStart.y + tileSet.tileHeight;

  const tilesToReplace = tileMap.getTilesWithinWorldXY(
    tileStart.x,
    tileStart.y - tileSet.tileHeight,
    areaWidthX,
    areaWidthY,
  );

  tilesToReplace.forEach((tile: Phaser.Tilemaps.Tile) => {
    tile.index = 33; // Replace with default wall
    tile.setCollision(false);
  });
}

function button1Activated(): void {
  const eventGameItems = eventGameItemCollection.getItemByEventName('mapEvent1');

  removeWalls(eventGameItems);
}

function button2Activated(): void {
  const eventGameItemArray = eventGameItemCollection.getItemByEventName('mapEvent2');

  if (eventGameItemArray.length === 0) {
    // wrong room!
    return;
  }

  const eventGameItem = eventGameItemArray[0];

  const newPlatform = Platform.makeAdditional(gameScene, eventGameItem.x, eventGameItem.y);

  gameScene.physics.add.collider(
    playerSprite,
    newPlatform,
  );
}

function button3Activated(): void {
  const eventGameItems = eventGameItemCollection.getItemByEventName('mapEvent3');

  removeWalls(eventGameItems);
}


function button4Activated(): void {
  const eventGameItems = eventGameItemCollection.getItemByEventName('mapEvent4');

  removeWalls(eventGameItems);
}

function button5Activated(): void {
  const eventGameItems = eventGameItemCollection.getItemByEventName('mapEvent5');

  removeWalls(eventGameItems);
}

function listenButtonEvents(
  scene: Phaser.Scene,
  eventGameItems: MapEventsGameItemCollection,
  player: Player,
): void {
  gameScene = scene;
  eventGameItemCollection = eventGameItems;
  playerSprite = player;
  EventDispatcher.getInstance().on('button1Activated', button1Activated);
  EventDispatcher.getInstance().on('button2Activated', button2Activated);
  EventDispatcher.getInstance().on('button3Activated', button3Activated);
  EventDispatcher.getInstance().on('button4Activated', button4Activated);
  EventDispatcher.getInstance().on('button5Activated', button5Activated);
}

export default listenButtonEvents;
