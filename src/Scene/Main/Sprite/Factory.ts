import Door from './Collidable/Dynamic/Door';
import Coin from './Collidable/Dynamic/Coin';
import Save from './Collidable/Static/Save';
import Player from './Player/Player';
import { createController } from './Player/controller';
import Backpack from './Player/Backpack';
import GameObject from './GameObject';
import Spike from './Collidable/Static/Spike';
import Platform from './Collidable/Static/Platform';
import Button from './Collidable/Dynamic/Button';
import GameEvent from './GameEvent';
import SeaWeed from './Decoration/SeaWeed';
import Spear from './Collidable/Static/Enemy/Spear';
import Ball from './Collidable/Static/Enemy/Ball';
import Portal from './Collidable/Static/Portal';
import Spring from './Collidable/Static/Spring';
import SmallFish from './Decoration/SmallFish';
import BigFish from './Decoration/BigFish';
import SpikePlatform from './Collidable/Static/SpikePlatform';
import Conveyor from './Collidable/Static/Conveyor';
import Cannon from './Collidable/Static/Enemy/Cannon';
import { GameItem, GameItemCollection, StaticGameItemCollection } from '../GameItem/types';
import Crab from './Collidable/Static/Enemy/Crab';
import InvisibleWall from './Collidable/Static/InvisibleWall';
import Mummy from './Collidable/Static/Enemy/Mummy';
import Counter from './Decoration/Counter';
import Robot from './Collidable/Static/Enemy/Robot';
import PortalDestination from './Decoration/PortalDestination';
import Light from './Decoration/Light';
import Ruby from './Collidable/Static/Ruby';
import Anchor from './Decoration/Anchor';
import TextSprite from './Decoration/TextSprite';

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
  5: PortalDestination,
  6: Save,
  7: Spike,
  8: Light,
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
  21: Crab,
  22: InvisibleWall,
  23: Mummy,
  24: Counter,
  25: Robot,
  26: Ruby,
  27: Anchor,
  28: TextSprite,
};

const mapEventItemClasses = {
  11: GameEvent,
};

let leftKey: Phaser.Input.Keyboard.Key = null;

let rightKey: Phaser.Input.Keyboard.Key = null;

function makePlayer(scene: Phaser.Scene, playerItem: GameItem): Player {
  // movement keys need to be reused when the scene is restarted (i.e. when a new room is reached)
  leftKey = scene.input.keyboard.addKey(leftKey ?? 'LEFT');
  rightKey = scene.input.keyboard.addKey(rightKey ?? 'RIGHT');

  const controller = createController(leftKey, rightKey);

  const player = new Player(
    scene,
    playerItem,
    controller,
    new Backpack(playerItem.properties),
  );

  player.setVelocityY(playerItem.otherProperties?.velocityY ?? 0);

  return player;
}

function makeSingleSprite(scene: Phaser.Scene, gameItem: GameItem): GameObject {
  const ItemClass = dynamicItemClasses[gameItem.id] ?? staticItemClasses[gameItem.id];

  return new ItemClass(scene, gameItem);
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

  // Player has no GameItem and must be created for each room.
  // When saving in memory or file, we have to store the items and the player
  // in two separate entries.
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
