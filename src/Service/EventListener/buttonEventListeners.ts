import { GameItem, MapEventsGameItemCollection } from '../../Scene/Main/GameItem/types';
import GameObject from '../../Scene/Main/Sprite/GameObject';
import Player from '../../Scene/Main/Sprite/Player/Player';
import CannonBall from '../../Scene/Main/Sprite/Collidable/Static/Enemy/CannonBall';
import Platform from '../../Scene/Main/Sprite/Collidable/Static/Platform';
import Spike from '../../Scene/Main/Sprite/Collidable/Static/Spike';
import * as EventDispatcher from '../EventDispatcher';

let gameScene: Phaser.Scene;

let eventGameItemCollection: MapEventsGameItemCollection;

let playerSprite: Player;

let gameObjects: GameObject[];

let cannonBalls: CannonBall[];

let spikes: Spike[];

const defaultCaveWall = 33;

const defaultPyramidWall = 89;

const defaultBaseWall = 161;

function removeWalls(eventGameItems: GameItem[], newTileIndex: integer = defaultCaveWall): void {
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
    tile.index = newTileIndex; // Replace with default wall
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

function button6Activated(): void {
  const eventGameItems = eventGameItemCollection.getItemByEventName('mapEvent6');

  removeWalls(eventGameItems, defaultPyramidWall);
}

function button7Activated(): void {
  const eventGameItems = eventGameItemCollection.getItemByEventName('mapEvent7');

  removeWalls(eventGameItems, defaultBaseWall);
}

function button8Activated(): void {
  const eventGameItems = eventGameItemCollection.getItemByEventName('mapEvent8');

  removeWalls(eventGameItems, -1);
}

function button9Activated(): void {
  // This event activates a coin that is hidden. It should be the only hidden coin:
  gameObjects.forEach((child: GameObject) => {
    if (child.body) {
      child.body.setEnable(true);
    }
    child.setVisible(true);
  });
}

function button10Activated(): void {
  // This event deactivates a couple of cannons
  cannonBalls.forEach((child: CannonBall) => {
    child.deactivate();
  });
}

function button11Activated(): void {
  // This event deactivates a couple of spikes
  spikes.forEach((child: Spike) => {
    child.deactivate();
  });
}

function button12Activated(): void {
  // This event deactivates a couple of spikes
  spikes.forEach((child: Spike) => {
    child.deactivate();
  });
}

function button13Activated(): void {
  const eventGameItems = eventGameItemCollection.getItemByEventName('mapEvent13');

  removeWalls(eventGameItems, -1);

  // This event also activates and deactivates a couple of spikes
  spikes.forEach((child: Spike) => {
    child.deactivate();
    child.activate();
  });
}

function listenButtonEvents(
  scene: Phaser.Scene,
  eventGameItems: MapEventsGameItemCollection,
  player: Player,
  gameObjectsGroup: GameObject[],
  cannonBallsGroup: CannonBall[],
  spikesGroup: Spike[],
): void {
  gameScene = scene;
  eventGameItemCollection = eventGameItems;
  playerSprite = player;
  gameObjects = gameObjectsGroup;
  cannonBalls = cannonBallsGroup;
  spikes = spikesGroup;

  EventDispatcher.on('button1Activated', button1Activated);
  EventDispatcher.on('button2Activated', button2Activated);
  EventDispatcher.on('button3Activated', button3Activated);
  EventDispatcher.on('button4Activated', button4Activated);
  EventDispatcher.on('button5Activated', button5Activated);
  EventDispatcher.on('button6Activated', button6Activated);
  EventDispatcher.on('button7Activated', button7Activated);
  EventDispatcher.on('button8Activated', button8Activated);
  EventDispatcher.on('button9Activated', button9Activated);
  EventDispatcher.on('button10Activated', button10Activated);
  EventDispatcher.on('button11Activated', button11Activated);
  EventDispatcher.on('button12Activated', button12Activated);
  EventDispatcher.on('button13Activated', button13Activated);
}

export default listenButtonEvents;
