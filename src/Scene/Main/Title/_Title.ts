import config from '../../../../config/config.json';
import Button from '../UI/Button';

type Position = {
  x: integer,
  y: integer,
};

export default class Title {
  private camera: Phaser.Cameras.Scene2D.Camera;

  private body: Phaser.GameObjects.Rectangle;

  private newGameButton: Button;

  private continueButton: Button;

  private buttonOffset: integer = 32;

  private active: boolean = true;

  constructor(camera: Phaser.Cameras.Scene2D.Camera, scene: Phaser.Scene) {
    this.camera = camera;
    const position = this.getPositionFromCamera();
    this.body = scene.add.rectangle(
      position.x,
      position.y,
      config.gameWidth * 0.8,
      config.gameHeight * 0.3,
      0x991133,
    );
    this.body.setDepth(1);

    this.newGameButton = new Button(
      this.body.x - this.buttonOffset,
      this.body.getBottomCenter().y + this.buttonOffset,
      scene,
    );
    this.continueButton = new Button(
      this.body.x + this.buttonOffset,
      this.body.getBottomCenter().y + this.buttonOffset,
      scene,
    );
  }

  private getPositionFromCamera(): Position {
    return {
      x: this.camera.scrollX + config.gameWidth / 2,
      y: this.camera.scrollY + config.gameHeight / 3,
    };
  }

  public update(): void {
    if (!this.active) {
      return;
    }

    const position = this.getPositionFromCamera();
    this.body.setX(position.x);
    this.body.setY(position.y);
  }
}
