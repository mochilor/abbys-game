import Door from './GameObject/Door';
import Coin from './GameObject/Coin';
import Scuba from './GameObject/Scuba';
import Fins from './GameObject/Fins';
import Save from './GameObject/Save';
import Player from './Player/Player';
import { Controller } from './Player/Controller';
import Backpack from './Player/Backpack';
import GameObject from './GameObject';
import GameItemCollection from '../GameItem/GameItemCollection';
import GameItem from '../GameItem/GameItemInterface';
import Spike from './Static/Spike';
import StaticGameItemCollection from '../GameItem/StaticGameItemCollection';
import GameSprite from './GameSpriteInterface';

const dynamicItemClasses = {
  1: Coin,
  2: Player,
  3: Door,
  4: Scuba,
  5: Fins,
  6: Save,
};

const staticItemClasses = {
  7: Spike,
};

function makePlayer(scene: Phaser.Scene, gameItem: GameItem): Player {
  const controller = new Controller(
    scene.input.keyboard.addKey('LEFT'),
    scene.input.keyboard.addKey('RIGHT'),
    scene.input.keyboard.addKey('UP'),
  );

  return new Player(scene, gameItem.x, gameItem.y, controller, new Backpack());
}

function makeSingleSprite(scene: Phaser.Scene, gameItem: GameItem): GameSprite {
  const ItemClass = dynamicItemClasses[gameItem.id] ?? staticItemClasses[gameItem.id];

  const offset = 4;

  if (ItemClass === Player) {
    return makePlayer(scene, gameItem);
  }

  if (ItemClass === Spike) {
    let spikeOffsetY: number;
    let spikeOffsetX: number;

    if (gameItem.rotation === -180) { // V
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
    sprites.push(makeSingleSprite(scene, item));
  });

  return sprites;
}

export { dynamicItemClasses, staticItemClasses, makeSprites };
