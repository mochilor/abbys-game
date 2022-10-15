import config from '../../../../config/config.json';
import GameObject from '../Sprite/GameObject';
import BendWaves from './shader';

export default class BackgroundManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public setup(sprites: GameObject[], layer: Phaser.Tilemaps.TilemapLayer): void {
    if (!config.bg) {
      return;
    }

    const bg = this.scene.add.tileSprite(0, 0, config.gameWidth, config.gameHeight, 'bgUnderwater')
      .setOrigin(0, 0)
      .setDepth(-1000)
      .setScrollFactor(0);

    this.scene.cameras.main
      .setName('background')
      .setPostPipeline(BendWaves)
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
}
