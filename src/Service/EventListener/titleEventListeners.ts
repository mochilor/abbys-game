import Title from '../../Scene/Main/Title/types';
import * as EventDispatcher from '../EventDispatcher';
import { hasSavedGame, resetGame } from '../gameStore';

export default function listenTitleEvents(title: Title): void {
  function continueGame(): void {
    title.quit();
    EventDispatcher.emit('playerUnfrozen');
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

  EventDispatcher.on('continueButtonPressed', continueGame);
  EventDispatcher.on('newGameButtonPressed', newGame);
  EventDispatcher.on('confirmButtonPressed', confirm);
  EventDispatcher.on('cancelButtonPressed', cancel);
}
