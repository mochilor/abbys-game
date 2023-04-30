import createEnding from '../../Scene/Main/UI/Ending';
import { Ending } from '../../Scene/Main/UI/types';
import * as EventDispatcher from '../EventDispatcher';

export default function listenEndingEvents(scene: Phaser.Scene): void {
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

  EventDispatcher.on('playerGotRuby', start);
  EventDispatcher.on('rubyAnimation1Finished', showEndingText);
}
