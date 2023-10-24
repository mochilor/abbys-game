import Player from '../../Scene/Main/Sprite/Player/Player';
import { createController } from '../../Scene/Main/Sprite/Player/controller';

const leftControllerButton = document.getElementById('controller-left');
const rightControllerButton = document.getElementById('controller-right');

const leftKey = { isDown: false };
const rightKey = { isDown: false };

export default function listenHudButtonEvents(player: Player): void {
  const controller = createController(leftKey, rightKey);

  player.addTouchController(controller);

  leftControllerButton.addEventListener('touchstart', () => {
    leftControllerButton.style.opacity = '50%';
    leftKey.isDown = true;
  });

  leftControllerButton.addEventListener('touchend', () => {
    leftControllerButton.style.opacity = '100%';
    leftKey.isDown = false;
  });

  rightControllerButton.addEventListener('touchstart', () => {
    rightControllerButton.style.opacity = '50%';
    rightKey.isDown = true;
  });

  rightControllerButton.addEventListener('touchend', () => {
    rightControllerButton.style.opacity = '100%';
    rightKey.isDown = false;
  });

  document.addEventListener('fullscreenchange', () => {
    // if (navigator.maxTouchPoints > 0) {
    //   return;
    // }

    // // If we go full screen on computer, hide controls
    // leftControllerButton.classList.add('hidden');
    // rightControllerButton.classList.add('hidden');
  });
}
