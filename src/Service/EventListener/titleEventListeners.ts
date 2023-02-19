import * as EventDispatcher from '../EventDispatcher';

interface Title {
  quit: () => void,
}

export default function listenTitleEvents(title: Title): void {
  function startGame(): void {
    title.quit();
    EventDispatcher.emit('playerUnfrozen');
  }

  EventDispatcher.on('gameStarted', startGame);
}
