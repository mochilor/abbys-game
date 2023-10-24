const gameContainer = document.getElementById('game-container');

function enterFullScreen(): void {
  if (!gameContainer.requestFullscreen || document.fullscreenElement) {
    return;
  }

  gameContainer.requestFullscreen();

  screen.orientation.lock('landscape')
    .then(() => {
      // This means that we are in a mobile device
    })
    .catch((error) => console.error(error));
}

function exitFullScreen(): void {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    screen.orientation.unlock();
  }
}

export { enterFullScreen, exitFullScreen };
