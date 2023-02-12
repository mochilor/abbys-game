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
import CannonBall from './Static/Enemy/CannonBall';

export default class SpriteManager {
  private scene: Phaser.Scene;

  private player: Player;

  private spikesGroup: Spike[] = [];

  private doorsGroup: Door[] = [];

  private objectsGroup: GameObject[] = [];

  private platformsGroup: Platform[] = [];

  private spikePlatformsGroup: SpikePlatform[] = [];

  private cannonBallsGroup: CannonBall[] = [];

  private buttonsGroup: Button[] = [];

  private enemiesGroup: EnemyGameObject[] = [];

  private springsGroup: Spring[] = [];

  private conveyorsGroup: Conveyor[] = [];

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

    this.objects.forEach((sprite: GameObject) => {
      if (sprite instanceof Spike) {
        this.spikesGroup.push(sprite);
        return;
      }

      if (sprite instanceof Door) {
        this.doorsGroup.push(sprite);
        return;
      }

      if (sprite instanceof Platform) {
        this.platformsGroup.push(sprite);
        return;
      }

      if (sprite instanceof SpikePlatform) {
        this.spikePlatformsGroup.push(sprite);
        return;
      }

      if (sprite instanceof Button) {
        this.buttonsGroup.push(sprite);
        return;
      }

      if (sprite instanceof Spring) {
        this.springsGroup.push(sprite);
        return;
      }

      if (sprite instanceof Cannon) {
        sprite.setup();
        this.cannonBallsGroup.push(sprite.getCannonBall());
        return;
      }

      if (sprite instanceof EnemyGameObject) {
        this.enemiesGroup.push(sprite);
        return;
      }

      if (sprite instanceof Player) {
        this.player = sprite;
        return;
      }

      if (sprite instanceof Conveyor) {
        this.conveyorsGroup.push(sprite);
        return;
      }

      this.objectsGroup.push(sprite);
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
      this.spikesGroup,
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
    const conveyors = this.conveyorsGroup;

    Phaser.Utils.Array.StableSort(this.conveyorsGroup, (a: Conveyor, b: Conveyor) => {
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

  public getSpikePlatforms() {
    return this.spikePlatformsGroup;
  }

  public getCannonBallsGroup() {
    return this.cannonBallsGroup;
  }

  public update(time: number): void {
    this.platformsGroup.forEach((child: Platform) => {
      child.update();
    });
    this.spikePlatformsGroup.forEach((child: SpikePlatform) => {
      child.update(time);
    });
    this.enemiesGroup.forEach((child: EnemyGameObject) => {
      child.update();
    });
    this.cannonBallsGroup.forEach((child: CannonBall) => {
      child.update(time);
    });
    this.springsGroup.forEach((child: Spring) => {
      child.update();
    });
    this.objectsGroup.forEach((child: GameObject) => {
      child.update();
    });
  }

  public getObjects(): GameObject[] {
    return this.objects;
  }
}
