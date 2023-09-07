import Phaser from 'phaser';
import MapManager from './Map/MapManager';
import SpriteManager from './Sprite/Manager/SpriteManager';
import * as EventDispatcher from '../../Service/EventDispatcher';
import { hasSavedGame, loadGame } from '../../Service/gameStore';
import RoomName from './Map/RoomName';
import { getDebugRoomName, addDebugContainer } from './Debug/debug';
import * as CoinCounter from './GameItem/CoinCounter/CoinCounter';
import listenDebugEvents from '../../Service/EventListener/debugItemEventListeners';
import createTitle from './UI/Title';
import listenTitleEvents from '../../Service/EventListener/titleEventListeners';
import * as locatorFactory from './GameItem/Locator/Factory';
import setupBackground from './Background/BackgroundManager';
import listenSettingsEvents from '../../Service/EventListener/settingsEventListener';
import makeVirtualGameItemRepository from './GameItem/Virtual/VirtualGameItemRepository';
import { VirtualGameItem } from './GameItem/Virtual/types';
import listenSceneEvents from '../../Service/EventListener/sceneEventListeners';
import listenSoundEvents from '../../Service/EventListener/soundEventListener';
import makeSoundPlayer from '../../Service/SoundPlayer';
import { SoundPlayer } from '../../Service/types';
import listenHudButtonEvents from '../../Service/EventListener/hudButtonsEventListener';
import makePauseTimer from '../Pause/PauseTimer';
import { PauseTimeCounter } from '../Pause/types';

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

  private soundPlayer: SoundPlayer = null;

  private pauseTimer: PauseTimeCounter = null;

  constructor() {
    super({ key: 'Main' });
  }

  public create(data?: Data): void {
    EventDispatcher.removeAllListeners();

    this.initCoins();
    this.initPortalDestinations();
    addDebugContainer();
    listenDebugEvents();

    const roomName = getRoomName(data);
    const map = this.add.tilemap(roomName.getName());
    if (map.layers.length === 0) {
      throw new Error(`Non existing room: ${roomName.getName()}`);
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
      this.spriteManager.getCrabsGroup(),
      this.spriteManager.getInvisibleWallsGroup(),
      this.spriteManager.getMummiesGroup(),
      this.spriteManager.getRobotsGroup(),
      this.spriteManager.getAnchor(),
      map,
      'tilesetImage',
    );

    this.soundPlayer = this.soundPlayer || makeSoundPlayer(this);

    // In case of restart, we need to stop the music
    this.soundPlayer.stopTitleMusic();

    setupBackground(this, roomName);

    const player = this.spriteManager.getPlayer();

    player.initBackpack();

    listenSceneEvents(this, player);

    this.createTitle();

    listenSettingsEvents(this.soundPlayer);

    listenSoundEvents(this, this.soundPlayer);

    listenHudButtonEvents(player);

    if (this.registry.get('endingInProgress')) {
      EventDispatcher.emit('endingAnimationRunning');
    }

    this.pauseTimer = makePauseTimer(this);
  }

  private initCoins(): void {
    const coinsTotal = this.registry.get('coinsTotal');
    if (coinsTotal) {
      CoinCounter.init(coinsTotal);
      this.registry.remove('coinsTotal');
    }
    CoinCounter.reset();
  }

  private initPortalDestinations(): void {
    const portalDestinations: VirtualGameItem[] = this.registry.get('portalDestinations');
    if (portalDestinations) {
      const virtualGameItemRepository = makeVirtualGameItemRepository();

      portalDestinations.forEach((virtualGameItem: VirtualGameItem) => {
        virtualGameItemRepository.add(virtualGameItem);
      });

      this.registry.remove('portalDestinations');
    }
  }

  private createTitle(): void {
    if (this.registry.get('start')) {
      const title = createTitle(this, hasSavedGame());
      this.registry.remove('start');
      listenTitleEvents(title);
      this.soundPlayer.playTitleMusic();
      this.input.on('pointerdown', () => EventDispatcher.emit('titleTouched'));
      return;
    }

    EventDispatcher.emit('playerUnfrozen');
  }

  update(realTime: number): void {
    this.mapManager.updateCurrentRoom(this.spriteManager.getPlayer());

    const time = realTime - this.pauseTimer.calculatePauseTime(realTime);

    this.spriteManager.update(time);
  }
}
