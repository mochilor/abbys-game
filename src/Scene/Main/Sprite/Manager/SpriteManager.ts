import GameObject from '../GameObject';
import Player from '../Player/Player';
import Platform from '../Collidable/Static/Platform';
import RoomName from '../../Map/RoomName';
import EnemyGameObject from '../Collidable/Static/Enemy/EnemyGameObject';
import Spring from '../Collidable/Static/Spring';
import SpikePlatform from '../Collidable/Static/SpikePlatform';
import listenButtonEvents from '../../../../Service/EventListener/buttonEventListeners';
import listenDoorEvents from '../../../../Service/EventListener/doorEventListeners';
import listenGameItemEvents from '../../../../Service/EventListener/gameItemEventListeners';
import CannonBall from '../Collidable/Static/Enemy/CannonBall';
import GameItemLocator from '../../GameItem/GameItemLocatorInterface';
import MapGameItemLocator from '../../GameItem/MapGameItemLocatorInterface';
import GameItemHandler from './GameItemHandler';
import { makeSpriteStore, SpriteStore } from './SpriteStore';
import setupColliders from './SpriteCollider';

export default class SpriteManager {
  private scene: Phaser.Scene;

  private spritesStore: SpriteStore;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public prepareObjects(
    roomName: RoomName,
    inMemoryLocator: GameItemLocator,
    saveGameLocator: GameItemLocator,
    mapLocator: GameItemLocator & MapGameItemLocator,
  ): void {
    const gameItemHandler = GameItemHandler(
      inMemoryLocator,
      saveGameLocator,
      mapLocator,
    );
    const dynamicGameItems = gameItemHandler.getGameItems(roomName);
    const staticGameItems = gameItemHandler.getStaticGameItems(roomName);
    const mapEventGameItems = gameItemHandler.getMapEventGameItems(roomName);
    const playerGameItem = gameItemHandler.getPlayerGameItem();

    this.spritesStore = makeSpriteStore(
      this.scene,
      dynamicGameItems,
      staticGameItems,
      playerGameItem,
    );

    setupColliders(this.scene, this.spritesStore);

    listenGameItemEvents(dynamicGameItems, playerGameItem, this.scene.registry);
    listenButtonEvents(
      this.scene,
      mapEventGameItems,
      this.spritesStore.player,
      this.spritesStore.objects,
      this.spritesStore.cannonBalls,
      this.spritesStore.spikes,
    );
    listenDoorEvents(this.spritesStore.doors);
  }

  public getPlayer(): Player {
    return this.spritesStore.player;
  }

  public getSpikePlatforms() {
    return this.spritesStore.spikePlatforms;
  }

  public getCannonBallsGroup() {
    return this.spritesStore.cannonBalls;
  }

  public update(time: number): void {
    this.spritesStore.platforms.forEach((child: Platform) => {
      child.update();
    });
    this.spritesStore.spikePlatforms.forEach((child: SpikePlatform) => {
      child.update(time);
    });
    this.spritesStore.enemies.forEach((child: EnemyGameObject) => {
      child.update();
    });
    this.spritesStore.cannonBalls.forEach((child: CannonBall) => {
      child.update(time);
    });
    this.spritesStore.springs.forEach((child: Spring) => {
      child.update();
    });
    this.spritesStore.objects.forEach((child: GameObject) => {
      child.update();
    });
    this.spritesStore.player.update();
  }
}
