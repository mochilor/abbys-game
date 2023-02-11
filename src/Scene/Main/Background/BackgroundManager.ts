import config from '../../../../config/config.json';
import RoomName from '../Map/RoomName';
import GameObject from '../Sprite/GameObject';

export default class BackgroundManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public setup(
    roomName: RoomName,
    sprites: GameObject[],
    layer: Phaser.Tilemaps.TilemapLayer,
  ): void {
    this.setBackgroundColor(roomName);

    if (!config.bg) {
      return;
    }

    const bg = this.scene.add.tileSprite(0, 0, config.gameWidth, config.gameHeight, 'bgUnderwater')
      .setOrigin(0, 0)
      .setDepth(-1000)
      .setScrollFactor(0);

    this.scene.cameras.main
      .setName('background')
      // .setPostPipeline(BendWaves)
      .ignore(sprites)
      .ignore(layer);

    const frontCamera = this.scene.cameras.add(
      this.scene.cameras.main.x,
      this.scene.cameras.main.y,
      config.gameWidth,
      config.gameHeight,
      true,
      'front',
    );

    frontCamera.ignore(bg);
    // frontCamera.setScroll(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);
  }

  private setBackgroundColor(roomName: RoomName): void {
    const bgColors = config.levelColors;

    const currentBgColor = bgColors[roomName.zone()].bg;

    document.body.setAttribute('style', `background-color: #${currentBgColor};`);
    this.scene.cameras.main.setBackgroundColor(currentBgColor);
  }
}
