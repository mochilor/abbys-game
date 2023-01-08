import Door from './Dynamic/Door';
import Coin from './Dynamic/Coin';
import Save from './Static/Save';
import Player from './Player/Player';
import Controller from './Player/Controller';
import Backpack from './Player/Backpack';
import GameObject from './GameObject';
import GameItemCollection from '../GameItem/GameItemCollection';
import GameItem from '../GameItem/GameItemInterface';
import Spike from './Static/Spike';
import StaticGameItemCollection from '../GameItem/StaticGameItemCollection';
import GameSprite from './GameSpriteInterface';
import Platform from './Static/Platform';
import Button from './Dynamic/Button';
import GameEvent from './GameEvent/GameEvent';
import SeaWeed from './Static/Decoration/SeaWeed';
import Spear from './Static/Enemy/Spear';
import Ball from './Static/Enemy/Ball';
import Portal from './Static/Portal';
import RoomName from '../Map/RoomName';
import Spring from './Static/Spring';
import SmallFish from './Static/Decoration/SmallFish';
import BigFish from './Static/Decoration/BigFish';
import SpikePlatform from './Static/SpikePlatform';
import Conveyor from './Static/Conveyor';
import Cannon from './Static/Enemy/Cannon';

const playerItemClass = {
  2: Player,
};

const dynamicItemClasses = {
  1: Coin,
  3: Door,
  10: Button,
};

const staticItemClasses = {
  4: Spring,
  6: Save,
  7: Spike,
  9: Platform,
  12: SeaWeed,
  13: Spear,
  14: Ball,
  15: Portal,
  16: SmallFish,
  17: BigFish,
  18: SpikePlatform,
  19: Conveyor,
  20: Cannon,
};

const mapEventItemClasses = {
  11: GameEvent,
};

function makePlayer(scene: Phaser.Scene, playerItem: GameItem): Player {
  let otherProperties = {};

  playerItem.properties.forEach((property) => {
    if (property.name === 'otherProperties') {
      otherProperties = property.value;
    }
  });

  const leftKey = scene.input.keyboard.addKey('LEFT');
  leftKey.isDown = otherProperties.leftKeyIsDown ?? false;

  const rightKey = scene.input.keyboard.addKey('RIGHT');
  rightKey.isDown = otherProperties.rightKeyIsDown ?? false;

  const controller = new Controller(
    leftKey,
    rightKey,
  );

  const player = new Player(
    scene,
    playerItem.x,
    playerItem.y,
    controller,
    new Backpack(playerItem.properties),
  );

  player.setVelocityY(otherProperties.velocityY ?? 0); // still needed?

  return player;
}

function makeSingleSprite(scene: Phaser.Scene, gameItem: GameItem): GameSprite {
  const ItemClass = dynamicItemClasses[gameItem.id] ?? staticItemClasses[gameItem.id];

  const offset = 4;

  if (ItemClass === Spike || ItemClass === Cannon) {
    let offsetY: number;
    let offsetX: number;

    if (Math.abs(gameItem.rotation) === 180) { // V
      offsetX = -offset;
      offsetY = -offset;
    } else if (gameItem.rotation === -90 || gameItem.rotation === 270) { // <
      offsetX = -offset;
      offsetY = offset;
    } else if (gameItem.rotation === 0) { // ^
      offsetX = offset;
      offsetY = offset;
    } else if (gameItem.rotation === 90) { // >
      offsetY = -offset;
      offsetX = offset;
    }

    return new ItemClass(
      scene,
      gameItem.x + offsetX,
      gameItem.y - offsetY,
      gameItem.rotation,
      gameItem.properties,
    );
  }

  if (ItemClass === Spear) {
    return new Spear(
      scene,
      gameItem.x,
      gameItem.y,
      gameItem.rotation,
    );
  }

  if (ItemClass === Ball) {
    let radius = 0;

    gameItem.properties.forEach((property) => {
      if (property.name === 'radius') {
        radius = parseInt(property.value as string, 10);
      }
    });

    return new Ball(
      scene,
      gameItem.x + offset,
      gameItem.y - offset,
      radius,
    );
  }

  if (ItemClass === Portal) {
    let x: number;
    let y: number;
    let room: RoomName;

    gameItem.properties.forEach((property) => {
      if (property.name === 'destinationRoom') {
        room = RoomName.fromName(property.value as string);
      }

      if (property.name === 'destinationX') {
        x = parseInt(property.value as string, 10);
      }

      if (property.name === 'destinationY') {
        y = parseInt(property.value as string, 10);
      }
    });

    if (!room || !x || !y) {
      throw new Error('Invalid portal destination');
    }

    return new Portal(
      scene,
      gameItem.x + 4,
      gameItem.y - 4,
      { room, x, y },
      gameItem.roomName,
    );
  }

  return new ItemClass(
    scene,
    gameItem.x + offset,
    gameItem.y - offset,
    gameItem.uuid,
    gameItem.properties,
    gameItem.roomName,
  );
}

function makeSprites(
  scene: Phaser.Scene,
  dynamicGameItems: GameItemCollection,
  staticGameItems: StaticGameItemCollection,
  playerGameItem: GameItem,
): GameObject[] {
  const dynamicItems = dynamicGameItems.getItems();
  const staticItems = staticGameItems.getItems();

  const items = dynamicItems.concat(staticItems);

  const sprites = [];

  items.forEach((item: GameItem) => {
    sprites.push(makeSingleSprite(scene, item));
  });

  // Player no tiene que tener gameItem y se tiene que crear en cada room
  // Al persistirn em meoria o fichero, hay que guaradart los items
  // y el player (en dos entradas separadas)
  sprites.push(makePlayer(scene, playerGameItem));

  return sprites;
}

export {
  playerItemClass,
  dynamicItemClasses,
  staticItemClasses,
  mapEventItemClasses,
  makeSprites,
};
