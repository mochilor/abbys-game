import listenGameItemEvents from '../GameItem/eventListeners';
import MapLocator from '../GameItem/Locator/MapLocator';
import SaveGameLocator from '../GameItem/Locator/SaveGameLocator';
import StaticGameItemCollection from '../GameItem/StaticGameItemCollection';
import { makeSprites } from './factory';
import GameObject from './GameObject';
import Door from './Dynamic/Door';
import Player from './Player/Player';
import Spike from './Static/Spike';
import GameItemCollection from '../GameItem/GameItemCollection';
import Platform from './Static/Platform';
import Button from './Dynamic/Button';
import { listenButtonEvents, listenSaveEvents } from './Static/eventListeners';
import MapEventsGameItemCollection from '../GameItem/MapEventsGameItemCollection';
import listenDoorEvents from './Dynamic/eventListeners';
import listenPlayerEvents from './Player/eventListeners';
import InMemoryGameLocator from '../GameItem/Locator/InMemoryGameLocator';
import GameItem from '../GameItem/GameItemInterface';

export default class SpriteManager {
  private scene: Phaser.Scene;

  private player: Player;

  private spikesGroup: Phaser.GameObjects.Group;

  private doorsGroup: Phaser.GameObjects.Group;

  private objectsGroup: Phaser.GameObjects.Group;

  private platformsGroup: Phaser.GameObjects.Group;

  private buttonsGroup: Phaser.GameObjects.Group;

  private inMemoryLocator: InMemoryGameLocator;

  private saveGameLocator: SaveGameLocator;

  private mapLocator: MapLocator;

  constructor(
    scene: Phaser.Scene,
    inMemoryLocator: InMemoryGameLocator,
    saveGameLocator: SaveGameLocator,
    mapLocator: MapLocator,
  ) {
    this.scene = scene;
    this.inMemoryLocator = inMemoryLocator;
    this.saveGameLocator = saveGameLocator;
    this.mapLocator = mapLocator;
  }

  public prepareObjects(roomName: string): void {
    const dynamicGameItems = this.getGameItems(roomName);
    const staticGameItems = this.getStaticGameItems();
    const mapEventGameItems = this.getMapEventGameItems();
    const playerGameItem = this.getPlayerGameItem(roomName);

    const objects = makeSprites(this.scene, dynamicGameItems, staticGameItems, playerGameItem);

    this.spikesGroup = this.scene.add.group();
    this.doorsGroup = this.scene.add.group();
    this.objectsGroup = this.scene.add.group();
    this.platformsGroup = this.scene.add.group();
    this.buttonsGroup = this.scene.add.group();

    objects.forEach((sprite: GameObject) => {
      if (sprite instanceof Spike) {
        this.spikesGroup.add(sprite);
        return;
      }

      if (sprite instanceof Door) {
        this.doorsGroup.add(sprite);
        return;
      }

      if (sprite instanceof Platform) {
        this.platformsGroup.add(sprite);
        return;
      }

      if (sprite instanceof Button) {
        this.buttonsGroup.add(sprite);
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

    this.scene.physics.add.collider(
      this.player,
      this.buttonsGroup,
      this.player.activateButton,
      null,
      this.player,
    );

    this.scene.physics.add.collider(
      this.player,
      this.platformsGroup,
      this.player.touchPlatform,
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

    listenGameItemEvents(dynamicGameItems, playerGameItem, this.scene.registry);
    listenButtonEvents(this.scene, mapEventGameItems);
    listenDoorEvents(this.doorsGroup);
    listenPlayerEvents(this.player);
    listenSaveEvents(this.objectsGroup);
  }

  private getGameItems(roomName: string): GameItemCollection {
    try {
      try {
        return this.inMemoryLocator.getGameItemCollection(roomName);
      } catch (error) {
        return this.saveGameLocator.getGameItemCollection(roomName);
      }
    } catch (error) {
      return this.mapLocator.getGameItemCollection();
    }
  }

  private getStaticGameItems(): StaticGameItemCollection {
    return this.mapLocator.getStaticGameItemCollection();
  }

  private getMapEventGameItems(): MapEventsGameItemCollection {
    return this.mapLocator.getMapEventsGameItemCollection();
  }

  private getPlayerGameItem(roomName: string): GameItem {
    try {
      try {
        return this.inMemoryLocator.getPlayerGameItem(roomName);
      } catch (error) {
        return this.saveGameLocator.getPlayerGameItem(roomName);
      }
    } catch (error) {
      return this.mapLocator.getPlayerGameItem();
    }
  }

  public getPlayer(): Player {
    return this.player;
  }

  public update(): void {
    this.platformsGroup.children.iterate((child: Platform) => {
      child.update();
    });
  }
}
