import Door from './Door';
import { GameItem } from '../Interfaces';
import Coin from './Coin';
import Scuba from './Scuba';
import Fins from './Fins';
import Save from './Save';
import Player from './Player/Player';

const itemClasses = {
  1: Coin,
  2: Player,
  3: Door,
  4: Scuba,
  5: Fins,
  6: Save,
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
