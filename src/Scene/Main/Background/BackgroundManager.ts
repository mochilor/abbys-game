import config from '../../../../config/config.json';
import RoomName from '../Map/RoomName';

export default class BackgroundManager {
  constructor(private scene: Phaser.Scene) {}

  public setup(roomName: RoomName): void {
    this.setBackgroundColor(roomName);

    // frontCamera.setScroll(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);
  }

  private setBackgroundColor(roomName: RoomName): void {
    const bgColors = config.levelColors;

    const currentBgColor = bgColors[roomName.zone()].bg;

    document.body.setAttribute('style', `background-color: #${currentBgColor};`);
    this.scene.cameras.main.setBackgroundColor(currentBgColor);
  }
}
