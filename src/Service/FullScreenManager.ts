const gameContainer = document.getElementById('game-container');

export default function enterFullScreen(): void {
  if (process.env.BUILD === 'itchio') {
    return;
  }

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
