import * as EventDispatcher from '../EventDispatcher';

interface Title {
  quit: () => void,
  update: () => void,
}

export default function listenTitleEvents(title: Title): void {
  function startGame(): void {
    title.quit();
    EventDispatcher.emit('playerUnfrozen');
  }

  function centerTitle(): void {
    title.update();
  }

  EventDispatcher.on('gameStarted', startGame);
  EventDispatcher.on('cameraUpdated', centerTitle);
}
