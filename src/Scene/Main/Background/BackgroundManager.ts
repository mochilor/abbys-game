import config from '../../../../config/config.json';
import RoomName from '../Map/RoomName';

export default function setupBackground(scene: Phaser.Scene, roomName: RoomName) {
  const bgColors = config.levelColors;

  const currentBgColor = bgColors[roomName.zone()].bg;

  document.body.setAttribute('style', `background-color: #${currentBgColor};`);
  scene.cameras.main.setBackgroundColor(currentBgColor);
}
