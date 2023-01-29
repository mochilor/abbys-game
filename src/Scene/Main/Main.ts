import Phaser from 'phaser';
import MapManager from './Map/MapManager';
import Player from './Sprite/Player/Player';
import SpriteManager from './Sprite/SpriteManager';
import EventDispatcher from '../../Service/EventDispatcher';
import SaveGameLocator from './GameItem/Locator/SaveGameLocator';
import MapLocator from './GameItem/Locator/MapLocator';
import InMemoryGameLocator from './GameItem/Locator/InMemoryGameLocator';
import { loadGame } from '../../Service/gameStore';
import RoomName from './Map/RoomName';
import BackgroundManager from './Background/BackgroundManager';
import { getDebugRoomName, addDebugContainer } from './Debug/debug';
import CoinCounter from './GameItem/CoinCounter/CoinCounter';
import listenDebugEvents from '../../Service/EventListener/debugItemEventListeners';

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
  private player: Player;

  private spriteManager: SpriteManager;

  private mapManager: MapManager;

  constructor() {
    super({ key: 'Main' });
  }

  public create(data?: Data): void {  
    EventDispatcher.getInstance().removeAllListeners();

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

    this.spriteManager = new SpriteManager(
      this,
      new InMemoryGameLocator(this),
      new SaveGameLocator(this.registry),
      new MapLocator(map),
    );
    this.spriteManager.prepareObjects(roomName);

    this.player = this.spriteManager.getPlayer();
    this.mapManager = new MapManager(this, roomName);
    this.mapManager.setup(
      this.player,
      this.spriteManager.getSpikePlatforms(),
      this.spriteManager.getCannonBallsGroup(),
      map,
      'tilesetImage',
    );

    (new BackgroundManager(this)).setup(
      roomName,
      this.spriteManager.getObjects(),
      this.mapManager.getLayer(),
    );

    this.player.initBackpack();

    EventDispatcher.getInstance().on('playerHasDied', this.playerHasDied, this);
    EventDispatcher.getInstance().on('newRoomReached', this.scene.restart, this.scene);
  }

  private playerHasDied(): void {
    this.registry.reset();
    this.scene.restart({});
  }

  update(time: number): void {
    this.player.update();
    this.mapManager.updateCurrentRoom(this.player);
    this.spriteManager.update(time);
  }
}
