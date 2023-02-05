import EventDispatcher from '../EventDispatcher';

interface Title {
  quit: () => void,
}

export default function listenTitleEvents(title: Title): void {
  function startGame(): void {
    title.quit();
    EventDispatcher.getInstance().emit('playerUnfrozen');
  }

  EventDispatcher.getInstance().on('gameStarted', startGame);
}
