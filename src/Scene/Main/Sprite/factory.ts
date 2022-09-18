import Door from './Dynamic/Door';
import Coin from './Dynamic/Coin';
import Scuba from './Dynamic/Scuba';
import Hands from './Dynamic/Hands';
import Save from './Dynamic/Save';
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

const dynamicItemClasses = {
  1: Coin,
  2: Player,
  3: Door,
  4: Scuba,
  5: Hands,
  6: Save,
  8: Feet,
};

const staticItemClasses = {
  7: Spike,
  9: Platform,
};

let playerItem: GameItem = null;

function makePlayer(scene: Phaser.Scene, gameItem: GameItem): Player {
  const controller = new Controller(
    scene.input.keyboard.addKey('LEFT'),
    scene.input.keyboard.addKey('RIGHT'),
    scene.input.keyboard.addKey('UP'),
  );

  return new Player(scene, gameItem.x, gameItem.y, controller, new Backpack(gameItem.properties));
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
    gameItem.uuid,
    gameItem.properties,
  );
}

function makeSprites(
  scene: Phaser.Scene,
  dynamicGameItems: GameItemCollection,
  staticGameItems: StaticGameItemCollection,
): GameObject[] {
  const dynamicItems = dynamicGameItems.getItems();
  const staticItems = staticGameItems.getItems();

  const items = dynamicItems.concat(staticItems);

  const sprites = [];

  items.forEach((item: GameItem) => {
    // make sure player is created in the last place:
    if (item.key === 'Player') {
      playerItem = item;
      return;
    }
    sprites.push(makeSingleSprite(scene, item));
  });

  if (playerItem) {
    sprites.push(makePlayer(scene, playerItem));
  }

  return sprites;
}

export { dynamicItemClasses, staticItemClasses, makeSprites };
