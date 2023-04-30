import SpriteManager from '../../Scene/Main/Sprite/Manager/SpriteManager';
import createEnding from '../../Scene/Main/UI/Ending';
import { Ending } from '../../Scene/Main/UI/types';
import * as EventDispatcher from '../EventDispatcher';

export default function listenEndingEvents(
  scene: Phaser.Scene,
  spriteManager: SpriteManager,
): void {
  let ending: Ending = null;

  function start(): void {
    ending = createEnding(scene);
    ending.start();
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
  }

  EventDispatcher.on('playerGotRuby', start);
  EventDispatcher.on('rubyAnimation1Finished', showEndingText);
  EventDispatcher.on('endingText1Complete', moveRubyToPlayer);
  EventDispatcher.on('rubyAnimation2Finished', hideEndingText);
}
