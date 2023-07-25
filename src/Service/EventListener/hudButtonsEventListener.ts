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
    leftKey.isDown = true;
  });

  leftControllerButton.addEventListener('touchend', () => {
    leftKey.isDown = false;
  });

  rightControllerButton.addEventListener('touchstart', () => {
    rightKey.isDown = true;
  });

  rightControllerButton.addEventListener('touchend', () => {
    rightKey.isDown = false;
  });
}
