import Phaser from 'phaser';
import MapManager from './Map/MapManager';
import SpriteManager from './Sprite/Manager/SpriteManager';
import * as EventDispatcher from '../../Service/EventDispatcher';
import { loadGame } from '../../Service/gameStore';
import RoomName from './Map/RoomName';
import { getDebugRoomName, addDebugContainer } from './Debug/debug';
import * as CoinCounter from './GameItem/CoinCounter/CoinCounter';
import listenDebugEvents from '../../Service/EventListener/debugItemEventListeners';
import * as locatorFactory from './GameItem/Locator/Factory';
import setupBackground from './Background/BackgroundManager';

interface Data {
  x: number,
  y: number,
}

function getRoomName(data?: Data): RoomName {
  if (data && Object.keys(data).length > 0) {
    return new RoomName(data.x, data.y);
  }

  const roomName = getDebugRoomName();

  if (roomName) {
    return RoomName.fromName(roomName);
  }

  const savedGame = loadGame();

  if (savedGame !== null) {
    return new RoomName(savedGame.room.x, savedGame.room.y);
  }

  return new RoomName(5, 0);
}

export default class Main extends Phaser.Scene {
  private spriteManager: SpriteManager;

  private mapManager: MapManager;

  constructor() {
    super({ key: 'Main' });
  }

  public create(data?: Data): void {
    EventDispatcher.removeAllListeners();

    const coinsTotal = this.registry.get('coinsTotal');
    if (coinsTotal) {
      CoinCounter.init(coinsTotal);
    }
    CoinCounter.reset();

    addDebugContainer();
    listenDebugEvents();

    const roomName = getRoomName(data);
    const map = this.add.tilemap(roomName.getName());
    if (map.layers.length === 0) {
      throw new Error(`Non existing room: ${roomName.getName()}`);
    }

    if (!map.getObjectLayer('objects')) {
      // alert('Oops, estás fuera!');
    }

    this.spriteManager = new SpriteManager(this);
    this.spriteManager.prepareObjects(
      roomName,
      locatorFactory.makeInMemoryGameLocator(this.registry),
      locatorFactory.makeSaveGameLocator(this.registry),
      locatorFactory.makeMapLocator(map),
    );

    this.mapManager = new MapManager(this, roomName);
    this.mapManager.setup(
      this.spriteManager.getPlayer(),
      this.spriteManager.getSpikePlatforms(),
      this.spriteManager.getCannonBallsGroup(),
      map,
      'tilesetImage',
    );

    setupBackground(this, roomName);

    this.spriteManager.getPlayer().initBackpack();

    EventDispatcher.on('playerHasDied', this.playerHasDied, this);
    EventDispatcher.on('newRoomReached', this.scene.restart, this.scene);
  }

  private playerHasDied(): void {
    this.registry.reset();
    this.scene.restart({});
  }

  update(time: number): void {
    this.mapManager.updateCurrentRoom(this.spriteManager.getPlayer());
    this.spriteManager.update(time);
  }
}
