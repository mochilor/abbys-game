import { GameItemCollection, StaticGameItemCollection, GameItem } from '../../GameItem/types';
import Button from '../Collidable/Dynamic/Button';
import Door from '../Collidable/Dynamic/Door';
import Conveyor from '../Collidable/Static/Conveyor';
import Cannon from '../Collidable/Static/Enemy/Cannon';
import CannonBall from '../Collidable/Static/Enemy/CannonBall';
import EnemyGameObject from '../Collidable/Static/Enemy/EnemyGameObject';
import InvisibleWall from '../Collidable/Static/InvisibleWall';
import Platform from '../Collidable/Static/Platform';
import Spike from '../Collidable/Static/Spike';
import SpikePlatform from '../Collidable/Static/SpikePlatform';
import Spring from '../Collidable/Static/Spring';
import { makeSprites } from '../Factory';
import GameObject from '../GameObject';
import Player from '../Player/Player';

export type SpriteStore = {
  spikes: Spike[],
  doors: Door[],
  platforms: Platform[],
  spikePlatforms: SpikePlatform[],
  buttons: Button[],
  springs: Spring[],
  cannonBalls: CannonBall[],
  enemies: EnemyGameObject[],
  conveyors: Conveyor[],
  objects: GameObject[],
  invisibleWalls: InvisibleWall[],
  player: Player,
  add(sprite: GameObject): void,
};

export function makeSpriteStore(
  scene: Phaser.Scene,
  dynamicGameItems: GameItemCollection,
  staticGameItems: StaticGameItemCollection,
  playerGameItem: GameItem,
): SpriteStore {
  const sprites = {
    spikes: [],
    doors: [],
    platforms: [],
    spikePlatforms: [],
    buttons: [],
    springs: [],
    cannonBalls: [],
    enemies: [],
    conveyors: [],
    objects: [],
    invisibleWalls: [],
    player: null,
    add(sprite: GameObject): void {
      if (sprite instanceof Spike) {
        sprites.spikes.push(sprite);
        return;
      }

      if (sprite instanceof Door) {
        sprites.doors.push(sprite);
        return;
      }

      if (sprite instanceof Platform) {
        sprites.platforms.push(sprite);
        return;
      }

      if (sprite instanceof SpikePlatform) {
        sprites.spikePlatforms.push(sprite);
        return;
      }

      if (sprite instanceof Button) {
        sprites.buttons.push(sprite);
        return;
      }

      if (sprite instanceof Spring) {
        sprites.springs.push(sprite);
        return;
      }

      if (sprite instanceof Cannon) {
        sprite.setup();
        sprites.cannonBalls.push(sprite.getCannonBall());
        return;
      }

      if (sprite instanceof EnemyGameObject) {
        sprites.enemies.push(sprite);
        return;
      }

      if (sprite instanceof Conveyor) {
        sprites.conveyors.push(sprite);
        return;
      }

      if (sprite instanceof InvisibleWall) {
        sprites.invisibleWalls.push(sprite);
        return;
      }

      if (sprite instanceof Player) {
        sprites.player = sprite;
        return;
      }

      sprites.objects.push(sprite);
    },
  };

  const objects = makeSprites(scene, dynamicGameItems, staticGameItems, playerGameItem);

  objects.forEach((sprite: GameObject) => {
    sprites.add(sprite);
  });

  function setupConvetors(): void {
    Phaser.Utils.Array.StableSort(sprites.conveyors, (a: Conveyor, b: Conveyor) => {
      if (a.x > b.x) {
        return -1;
      }

      return 1;
    });

    Phaser.Utils.Array.StableSort(sprites.conveyors, (a: Conveyor, b: Conveyor) => {
      if (a.y >= b.y) {
        return 1;
      }

      return -1;
    });

    for (let n = 0; n < sprites.conveyors.length; n += 1) {
      const previous = sprites.conveyors[n - 1] ?? null;
      const next = sprites.conveyors[n + 1] ?? null;
      sprites.conveyors[n].setup(previous, next);
    }
  }

  setupConvetors();

  return sprites;
}
