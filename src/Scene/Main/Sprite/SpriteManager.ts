import listenGameItemEvents from '../GameItem/eventListeners';
import MapLocator from '../GameItem/Locator/MapLocator';
import SaveGameLocator from '../GameItem/Locator/SaveGameLocator';
import StaticGameItemCollection from '../GameItem/StaticGameItemCollection';
import { makeSprites } from './factory';
import GameObject from './GameObject';
import Door from './GameObject/Door';
import Player from './Player/Player';
import Spike from './Static/Spike';
import map from '../../../../maps/map.json';
import GameItemCollection from '../GameItem/GameItemCollection';

export default class SpriteManager {
  private scene: Phaser.Scene;

  private player: Player;

  private spikesGroup: Phaser.GameObjects.Group;

  private doorsGroup: Phaser.GameObjects.Group;

  private objectsGroup: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public prepareObjects(): void {
    const dynamicGameItems = this.getGameItems();
    const staticGameItems = this.getStaticGameItems();

    const objects = makeSprites(this.scene, dynamicGameItems, staticGameItems);

    this.spikesGroup = this.scene.add.group();
    this.doorsGroup = this.scene.add.group();
    this.objectsGroup = this.scene.add.group();

    objects.forEach((sprite: GameObject) => {
      if (sprite instanceof Spike) {
        this.spikesGroup.add(sprite);
        return;
      }

      if (sprite instanceof Door) {
        this.doorsGroup.add(sprite);
        return;
      }

      if (sprite instanceof Player) {
        this.player = sprite;
        return;
      }

      this.objectsGroup.add(sprite);
    });

    this.scene.physics.add.collider(
      this.player,
      this.spikesGroup,
      this.player.touchSpike,
      null,
      this.player,
    );

    this.scene.physics.add.collider(
      this.player,
      this.doorsGroup,
      this.player.openDoor,
      null,
      this.player,
    );

    this.scene.physics.add.overlap(
      this.player,
      this.objectsGroup,
      this.player.collectItem as ArcadePhysicsCallback,
      null,
      this.player,
    );

    listenGameItemEvents(dynamicGameItems);
  }

  private getGameItems(): GameItemCollection {
    const saveGameLocator = new SaveGameLocator();

    try {
      return saveGameLocator.getGameItemCollection();
    } catch (error) {
      const gameItemLocator = new MapLocator(map);
      return gameItemLocator.getGameItemCollection();
    }
  }

  private getStaticGameItems(): StaticGameItemCollection {
    const gameItemLocator = new MapLocator(map);
    return gameItemLocator.getStaticGameItemCollection();
  }

  public getPlayer(): Player {
    return this.player;
  }
}
