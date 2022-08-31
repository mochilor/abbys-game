import Door from './Door';
import { GameItem } from '../Interfaces';
import Coin from './Coin';
import Scuba from './Scuba';
import Fins from './Fins';

const itemClasses = {
  1: Coin,
  3: Door,
  4: Scuba,
  5: Fins,
};

function make(scene: Phaser.Scene, gameItem: GameItem): Phaser.GameObjects.Sprite {
  const ItemClass = itemClasses[gameItem.id];

  const offset = 4;

  return new ItemClass(
    scene,
    gameItem.x + offset,
    gameItem.y - offset,
    ...gameItem.properties,
  );
}

export { itemClasses, make };
