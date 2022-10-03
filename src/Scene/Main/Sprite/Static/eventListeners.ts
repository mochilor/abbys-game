import EventDispatcher from '../../../../Service/EventDispatcher';
import GameItem from '../../GameItem/GameItemInterface';
import MapEventsGameItemCollection from '../../GameItem/MapEventsGameItemCollection';

let gameScene: Phaser.Scene;

let eventGameItemCollection: MapEventsGameItemCollection;

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
    // We are not in the right room
    return;
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

function listenButtonEvents(
  scene: Phaser.Scene,
  eventGameItems: MapEventsGameItemCollection,
): void {
  gameScene = scene;
  eventGameItemCollection = eventGameItems;
  EventDispatcher.getInstance().on('button1Activated', button1Activated);
}

export default listenButtonEvents;
