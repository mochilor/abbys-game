import Door from './Door';
import { GameItem, GameItemCollection } from '../GameItem/Interfaces';
import Coin from './Coin';
import Scuba from './Scuba';
import Fins from './Fins';
import Save from './Save';
import Player from './Player/Player';
import { Controller } from './Player/Controller';
import Backpack from './Player/Backpack';

const itemClasses = {
  1: Coin,
  2: Player,
  3: Door,
  4: Scuba,
  5: Fins,
  6: Save,
};

function makePlayer(scene: Phaser.Scene, gameItem: GameItem): Player {
  const controller = new Controller(
    scene.input.keyboard.addKey('LEFT'),
    scene.input.keyboard.addKey('RIGHT'),
    scene.input.keyboard.addKey('UP'),
  );

  return new Player(scene, gameItem.x, gameItem.y, controller, new Backpack());
}

function makeSingleObject(scene: Phaser.Scene, gameItem: GameItem): Phaser.GameObjects.Sprite {
  const ItemClass = itemClasses[gameItem.id];

  const offset = 4;

  if (ItemClass === Player) {
    return makePlayer(scene, gameItem);
  }

  return new ItemClass(
    scene,
    gameItem.x + offset,
    gameItem.y - offset,
    ...gameItem.properties,
  );
}

function makeObjects(
  scene: Phaser.Scene,
  gameItems: GameItemCollection,
): Phaser.GameObjects.Sprite[] {
  const { items } = gameItems;
  const objects = [];

  items.forEach((item: GameItem) => {
    objects.push(makeSingleObject(scene, item));
  });

  return objects;
}

export { itemClasses, makeObjects };
