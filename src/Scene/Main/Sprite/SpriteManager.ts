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
import listenButtonEvents from './Static/eventListeners';
import MapEventsGameItemCollection from '../GameItem/MapEventsGameItemCollection';
import listenDoorEvents from './Dynamic/eventListeners';
import InMemoryGameLocator from '../GameItem/Locator/InMemoryGameLocator';
import GameItem from '../GameItem/GameItemInterface';
import RoomName from '../Map/RoomName';
import EnemyGameObject from './Static/Enemy/EnemyGameObject';

export default class SpriteManager {
  private scene: Phaser.Scene;

  private player: Player;

  private spikesGroup: Phaser.GameObjects.Group;

  private doorsGroup: Phaser.GameObjects.Group;

  private objectsGroup: Phaser.GameObjects.Group;

  private platformsGroup: Phaser.GameObjects.Group;

  private buttonsGroup: Phaser.GameObjects.Group;

  private enemiesGroup: Phaser.GameObjects.Group;

  private inMemoryLocator: InMemoryGameLocator;

  private saveGameLocator: SaveGameLocator;

  private mapLocator: MapLocator;

  private objects: GameObject[];

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

  public prepareObjects(roomName: RoomName): void {
    const dynamicGameItems = this.getGameItems(roomName);
    const staticGameItems = this.getStaticGameItems(roomName);
    const mapEventGameItems = this.getMapEventGameItems(roomName);
    const playerGameItem = this.getPlayerGameItem();

    this.objects = makeSprites(this.scene, dynamicGameItems, staticGameItems, playerGameItem);

    this.spikesGroup = this.scene.add.group();
    this.doorsGroup = this.scene.add.group();
    this.objectsGroup = this.scene.add.group();
    this.platformsGroup = this.scene.add.group();
    this.buttonsGroup = this.scene.add.group();
    this.enemiesGroup = this.scene.add.group();

    this.objects.forEach((sprite: GameObject) => {
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

      if (sprite instanceof EnemyGameObject) {
        this.enemiesGroup.add(sprite);
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

    this.scene.physics.add.collider(
      this.player,
      this.enemiesGroup,
      this.player.touchEnemy,
      null,
      this.player,
    );

    listenGameItemEvents(dynamicGameItems, playerGameItem, this.scene.registry);
    listenButtonEvents(this.scene, mapEventGameItems);
    listenDoorEvents(this.doorsGroup);
  }

  private getGameItems(roomName: RoomName): GameItemCollection {
    try {
      try {
        return this.inMemoryLocator.getGameItemCollection(roomName);
      } catch (error) {
        return this.saveGameLocator.getGameItemCollection(roomName);
      }
    } catch (error) {
      return this.mapLocator.getGameItemCollection(roomName);
    }
  }

  private getStaticGameItems(roomName: RoomName): StaticGameItemCollection {
    return this.mapLocator.getStaticGameItemCollection(roomName);
  }

  private getMapEventGameItems(roomName: RoomName): MapEventsGameItemCollection {
    return this.mapLocator.getMapEventsGameItemCollection(roomName);
  }

  private getPlayerGameItem(): GameItem {
    try {
      try {
        return this.inMemoryLocator.getPlayerGameItem();
      } catch (error) {
        return this.saveGameLocator.getPlayerGameItem();
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
    this.enemiesGroup.children.iterate((child: Platform) => {
      child.update();
    });
  }

  public getObjects(): GameObject[] {
    return this.objects;
  }
}
