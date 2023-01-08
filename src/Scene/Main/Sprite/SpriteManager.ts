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
import MapEventsGameItemCollection from '../GameItem/MapEventsGameItemCollection';
import InMemoryGameLocator from '../GameItem/Locator/InMemoryGameLocator';
import GameItem from '../GameItem/GameItemInterface';
import RoomName from '../Map/RoomName';
import EnemyGameObject from './Static/Enemy/EnemyGameObject';
import Spring from './Static/Spring';
import SpikePlatform from './Static/SpikePlatform';
import listenButtonEvents from '../../../Service/EventListener/buttonEventListeners';
import listenDoorEvents from '../../../Service/EventListener/doorEventListeners';
import listenGameItemEvents from '../../../Service/EventListener/gameItemEventListeners';
import Conveyor from './Static/Conveyor';
import Cannon from './Static/Enemy/Cannon';

export default class SpriteManager {
  private scene: Phaser.Scene;

  private player: Player;

  private spikesGroup: Phaser.GameObjects.Group;

  private doorsGroup: Phaser.GameObjects.Group;

  private objectsGroup: Phaser.GameObjects.Group;

  private platformsGroup: Phaser.GameObjects.Group;

  private spikePlatformsGroup: Phaser.GameObjects.Group;

  private cannonBallsGroup: Phaser.GameObjects.Group;

  private buttonsGroup: Phaser.GameObjects.Group;

  private enemiesGroup: Phaser.GameObjects.Group;

  private springsGroup: Phaser.GameObjects.Group;

  private conveyorsGroup: Phaser.GameObjects.Group;

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
    this.spikePlatformsGroup = this.scene.add.group();
    this.buttonsGroup = this.scene.add.group();
    this.enemiesGroup = this.scene.add.group();
    this.springsGroup = this.scene.add.group();
    this.conveyorsGroup = this.scene.add.group();
    this.cannonBallsGroup = this.scene.add.group();

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

      if (sprite instanceof SpikePlatform) {
        this.spikePlatformsGroup.add(sprite);
        return;
      }

      if (sprite instanceof Button) {
        this.buttonsGroup.add(sprite);
        return;
      }

      if (sprite instanceof Spring) {
        this.springsGroup.add(sprite);
        return;
      }

      if (sprite instanceof Cannon) {
        sprite.setup();
        this.cannonBallsGroup.add(sprite.getCannonBall());
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

      if (sprite instanceof Conveyor) {
        this.conveyorsGroup.add(sprite);
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
      this.springsGroup,
      this.player.touchSpring,
      null,
      this.player,
    );

    this.scene.physics.add.collider(
      this.player,
      this.platformsGroup,
    );

    this.scene.physics.add.collider(
      this.player,
      this.spikePlatformsGroup,
      this.player.touchSpikePlatform,
    );

    this.scene.physics.add.collider(
      this.player,
      this.conveyorsGroup,
      this.player.touchConveyor,
    );

    this.scene.physics.add.overlap(
      this.player,
      this.objectsGroup,
      this.player.collectItem as ArcadePhysicsCallback,
      null,
      this.player,
    );

    this.scene.physics.add.overlap(
      this.player,
      this.enemiesGroup,
      this.player.touchEnemy,
      null,
      this.player,
    );

    this.scene.physics.add.overlap(
      this.player,
      this.cannonBallsGroup,
      this.player.touchEnemy,
      null,
      this.player,
    );

    listenGameItemEvents(dynamicGameItems, playerGameItem, this.scene.registry);
    listenButtonEvents(
      this.scene,
      mapEventGameItems,
      this.player,
      this.objectsGroup,
      this.cannonBallsGroup,
      this.spikesGroup
    );
    listenDoorEvents(this.doorsGroup);

    this.setupConveyors();
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

  private setupConveyors(): void {
    const conveyors = this.conveyorsGroup.getChildren() as Conveyor[];

    Phaser.Utils.Array.StableSort(conveyors, (a: Conveyor, b: Conveyor) => {
      if (a.x > b.x) {
        return -1;
      }

      return 1;
    });

    Phaser.Utils.Array.StableSort(conveyors, (a: Conveyor, b: Conveyor) => {
      if (a.y >= b.y) {
        return 1;
      }

      return -1;
    });

    for (let n = 0; n < conveyors.length; n += 1) {
      const previous = conveyors[n - 1] ?? null;
      const next = conveyors[n + 1] ?? null;
      conveyors[n].setup(previous, next);
    }
  }

  public getPlayer(): Player {
    return this.player;
  }

  public getSpikePlatforms(): Phaser.GameObjects.Group {
    return this.spikePlatformsGroup;
  }

  public getCannonBallsGroup(): Phaser.GameObjects.Group {
    return this.cannonBallsGroup;
  }

  public update(time: number): void {
    this.platformsGroup.children.iterate((child: Platform) => {
      child.update();
    });
    this.spikePlatformsGroup.children.iterate((child: SpikePlatform) => {
      child.update(time);
    });
    this.enemiesGroup.children.iterate((child: EnemyGameObject) => {
      child.update();
    });
    this.cannonBallsGroup.children.iterate((child: EnemyGameObject) => {
      child.update(time);
    });
    this.springsGroup.children.iterate((child: Spring) => {
      child.update();
    });
    this.objectsGroup.children.iterate((child: GameObject) => {
      child.update();
    });
  }

  public getObjects(): GameObject[] {
    return this.objects;
  }
}
