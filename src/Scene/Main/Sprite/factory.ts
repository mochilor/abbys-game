import Door from './Dynamic/Door';
import Coin from './Dynamic/Coin';
import Scuba from './Dynamic/Scuba';
import Hands from './Dynamic/Hands';
import Save from './Static/Save';
import Player from './Player/Player';
import { Controller } from './Player/Controller';
import Backpack from './Player/Backpack';
import GameObject from './GameObject';
import GameItemCollection from '../GameItem/GameItemCollection';
import GameItem from '../GameItem/GameItemInterface';
import Spike from './Static/Spike';
import StaticGameItemCollection from '../GameItem/StaticGameItemCollection';
import GameSprite from './GameSpriteInterface';
import Feet from './Dynamic/Feet';
import Platform from './Static/Platform';
import Button from './Dynamic/Button';
import GameEvent from './GameEvent/GameEvent';
import SeaWeed from './Static/Decoration/SeaWeed';

const playerItemClass = {
  2: Player,
};

const dynamicItemClasses = {
  1: Coin,
  3: Door,
  4: Scuba,
  5: Hands,
  8: Feet,
  10: Button,
};

const staticItemClasses = {
  6: Save,
  7: Spike,
  9: Platform,
  12: SeaWeed,
};

const mapEventItemClasses = {
  11: GameEvent,
};

function makePlayer(scene: Phaser.Scene, gameItem: GameItem): Player {
  const controller = new Controller(
    scene.input.keyboard.addKey('LEFT'),
    scene.input.keyboard.addKey('RIGHT'),
    scene.input.keyboard.addKey('UP'),
  );

  const player = new Player(
    scene,
    gameItem.x,
    gameItem.y,
    controller,
    new Backpack(gameItem.properties),
  );

  gameItem.properties.forEach((property) => {
    if (property.name === 'velocityY') {
      player.setVelocityY(property.value as number);
    }
  });

  return player;
}

function makeSingleSprite(scene: Phaser.Scene, gameItem: GameItem): GameSprite {
  const ItemClass = dynamicItemClasses[gameItem.id] ?? staticItemClasses[gameItem.id];

  const offset = 4;

  if (ItemClass === Spike) {
    let spikeOffsetY: number;
    let spikeOffsetX: number;

    if (Math.abs(gameItem.rotation) === 180) { // V
      spikeOffsetX = -offset;
      spikeOffsetY = -offset;
    } else if (gameItem.rotation === -90) { // <
      spikeOffsetX = -offset;
      spikeOffsetY = offset;
    } else if (gameItem.rotation === 0) { // ^
      spikeOffsetX = offset;
      spikeOffsetY = offset;
    } else if (gameItem.rotation === 90) { // >
      spikeOffsetY = -offset;
      spikeOffsetX = offset;
    }

    return new Spike(
      scene,
      gameItem.x + spikeOffsetX,
      gameItem.y - spikeOffsetY,
      gameItem.rotation,
    );
  }

  return new ItemClass(
    scene,
    gameItem.x + offset,
    gameItem.y - offset,
    gameItem.roomName,
    gameItem.uuid,
    gameItem.properties,
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

  scene.cameras.getCamera('background').ignore(sprites);

  return sprites;
}

export {
  playerItemClass,
  dynamicItemClasses,
  staticItemClasses,
  mapEventItemClasses,
  makeSprites,
};
