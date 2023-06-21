import { makeGameItem } from '../../Scene/Main/GameItem/Factory';
import Anchor from '../../Scene/Main/Sprite/Decoration/Anchor';
import SpriteManager from '../../Scene/Main/Sprite/Manager/SpriteManager';
import createEnding from '../../Scene/Main/UI/Ending';
import { Ending } from '../../Scene/Main/UI/types';
import * as EventDispatcher from '../EventDispatcher';
import config from '../../../config/config.json';
import Ruby from '../../Scene/Main/Sprite/Collidable/Static/Ruby';

let isRealEnding: boolean = false;

export default function listenEndingEvents(
  scene: Phaser.Scene,
  spriteManager: SpriteManager,
  registry: Phaser.Data.DataManager,
): void {
  let ending: Ending;

  function start(ruby: Ruby): void {
    ending = createEnding(scene);
    ending.init();
    isRealEnding = ruby.isReal();
  }

  function showEndingText(): void {
    if (!ending) {
      return;
    }

    ending.renderText();
  }

  function moveRubyToPlayer(): void {
    const player = spriteManager.getPlayer();
    const ruby = spriteManager.getRuby();

    if (!ruby) {
      return;
    }

    ruby.move(player.x, player.y + 3);
  }

  function hideEndingText(): void {
    if (!ending) {
      return;
    }

    ending.hide();
    ending = undefined;

    const anchor = spriteManager.getAnchor();

    if (!anchor) {
      return;
    }

    anchor.fall();
  }

  function anchorMoveUp(anchor: Anchor): void {
    anchor.startMovingUp();

    const player = spriteManager.getPlayer();
    player.hide();
    registry.set('endingInProgress', true);
  }

  function prepareNextEndingRoom(): void {
    ending = createEnding(scene);
    ending.start();
  }

  function moveToNextEndingRoom(): void {
    if (!registry.get('endingInProgress')) {
      return;
    }

    ending = createEnding(scene);
    const nextRoom = ending.getEndingRoom(isRealEnding);

    if (!nextRoom) {
      ending.renderFinalText();
      return;
    }

    EventDispatcher.emit(
      'newRoomReached',
      nextRoom,
      nextRoom,
      spriteManager.getPlayer(),
    );
  }

  function setupEndingAnimation(): void {
    ending = createEnding(scene);
    ending.startWithoutAnimation();
    ending.renderRoomText();
    ending.increaseEndingRoom();

    const x = config.gameWidth / 2;
    const player = spriteManager.getPlayer();
    player.x = x; // Move to the left part of the room
    player.hide();

    const gameItem = makeGameItem(
      27, // hardcoded id!
      x,
      config.gameHeight + 64,
      'Anchor',
      null,
      null,
      [],
    );

    const anchor = Anchor.makeAdditional(scene, gameItem);
    anchor.startMovingUp();

    // Add to the manager so it's updated every frame
    spriteManager.add(anchor);
  }

  EventDispatcher.on('playerGotRuby', start);
  EventDispatcher.on('rubyAnimation1Finished', showEndingText);
  EventDispatcher.on('endingText1Complete', moveRubyToPlayer);
  EventDispatcher.on('rubyAnimation2Finished', hideEndingText);
  EventDispatcher.on('anchorTouchedBottom', anchorMoveUp);
  EventDispatcher.on('anchorTouchedTop', prepareNextEndingRoom);
  EventDispatcher.on('endingAnimationRunning', setupEndingAnimation);
  EventDispatcher.on('endingBackgroundComplete', moveToNextEndingRoom);
}
