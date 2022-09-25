import EventDispatcher from '../../../../Service/EventDispatcher';
import GameItem from '../../GameItem/GameItemInterface';
import MapEventsGameItemCollection from '../../GameItem/MapEventsGameItemCollection';
import GameObject from '../GameObject';
import Save from './Save';

let gameScene: Phaser.Scene;

let eventGameItemCollection: MapEventsGameItemCollection;

let objectsGroup: Phaser.GameObjects.Group;

function button1Activated(): void {
  const eventGameItems = eventGameItemCollection.getItemByEventName('mapEvent1');

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
    throw new Error('Wrong map data');
  }

  const tileMap: Phaser.Tilemaps.Tilemap = gameScene.children.getFirst('type', 'TilemapLayer');
  const tileSet = tileMap.tileset[0];

  const areaWidthX = tileEnd.x - tileStart.x + tileSet.tileWidth;
  const areaWidthY = tileEnd.y - tileStart.y + tileSet.tileHeight;

  const tilesToRemove = tileMap.getTilesWithinWorldXY(
    tileStart.x,
    tileStart.y - tileSet.tileHeight,
    areaWidthX,
    areaWidthY,
  );

  tilesToRemove.forEach((tile: Phaser.Tilemaps.Tile) => {
    tile.setVisible(false);
    tile.setCollision(false);
  });
}

function resetSaves(): void {
  objectsGroup.children.iterate((gameObject: GameObject) => {
    if (gameObject instanceof Save) {
      gameObject.resetBody();
    }
  });
}

function listenButtonEvents(
  scene: Phaser.Scene,
  eventGameItems: MapEventsGameItemCollection,
): void {
  gameScene = scene;
  eventGameItemCollection = eventGameItems;
  EventDispatcher.getInstance().on('button1Activated', button1Activated);
}

function listenSaveEvents(objects: Phaser.GameObjects.Group): void {
  objectsGroup = objects;
  EventDispatcher.getInstance().on('newRoomReached', resetSaves);
}

export { listenButtonEvents, listenSaveEvents };
