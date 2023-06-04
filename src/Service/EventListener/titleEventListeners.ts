import { Title } from '../../Scene/Main/UI/types';
import * as EventDispatcher from '../EventDispatcher';
import { hasSavedGame, resetGame } from '../gameStore';

export default function listenTitleEvents(title: Title): void {
  function continueGame(): void {
    title.quit();
    EventDispatcher.emit('playerUnfrozen');
    EventDispatcher.emit('titleClosed');
  }

  function newGame(): void {
    if (!hasSavedGame()) {
      continueGame();
      return;
    }

    title.showAlertText();
  }

  function confirm(): void {
    resetGame();
    EventDispatcher.emit('gameReset');
  }

  function cancel(): void {
    title.hideAlertText();
  }

  function initTitle(): void {
    title.init();
  }

  EventDispatcher.on('continueButtonPressed', continueGame);
  EventDispatcher.on('newGameButtonPressed', newGame);
  EventDispatcher.on('confirmButtonPressed', confirm);
  EventDispatcher.on('cancelButtonPressed', cancel);
  EventDispatcher.on('titleTouched', initTitle);
}
