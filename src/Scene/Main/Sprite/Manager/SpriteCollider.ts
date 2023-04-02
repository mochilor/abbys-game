import Robot from '../Collidable/Static/Enemy/Robot';
import { SpriteStore } from './SpriteStore';

export default function setupColliders(scene: Phaser.Scene, sprites: SpriteStore) {
  scene.physics.add.collider(
    sprites.player,
    sprites.spikes,
    sprites.player.touchSpike,
    null,
    sprites.player,
  );

  scene.physics.add.collider(
    sprites.player,
    sprites.doors,
    sprites.player.openDoor,
    null,
    sprites.player,
  );

  scene.physics.add.collider(
    sprites.player,
    sprites.buttons,
    sprites.player.activateButton,
    null,
    sprites.player,
  );

  scene.physics.add.collider(
    sprites.player,
    sprites.springs,
    sprites.player.touchSpring,
    null,
    sprites.player,
  );

  scene.physics.add.collider(
    sprites.player,
    sprites.platforms,
  );

  scene.physics.add.collider(
    sprites.player,
    sprites.spikePlatforms,
    sprites.player.touchSpikePlatform,
  );

  scene.physics.add.collider(
    sprites.player,
    sprites.conveyors,
    sprites.player.touchConveyor,
  );

  scene.physics.add.overlap(
    sprites.player,
    sprites.objects,
    sprites.player.collectItem,
    null,
    sprites.player,
  );

  scene.physics.add.overlap(
    sprites.player,
    sprites.enemies,
    sprites.player.touchEnemy,
    null,
    sprites.player,
  );

  scene.physics.add.overlap(
    sprites.player,
    sprites.cannonBalls,
    sprites.player.touchEnemy,
    null,
    sprites.player,
  );

  scene.physics.add.overlap(
    sprites.player,
    (() => {
      const areas = [];
      sprites.enemies.forEach((enemy) => {
        if (enemy instanceof Robot) {
          areas.push(enemy.getDangerArea());
        }
      });

      return areas;
    })(),
  );
}
