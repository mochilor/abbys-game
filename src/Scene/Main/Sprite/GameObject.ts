export default abstract class GameObject extends Phaser.GameObjects.Sprite {
  private uuid: string;

  public static key: string;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, uuid: string) {
    super(scene, x, y, texture);
    this.uuid = uuid;
  }

  public getUuid(): string {
    return this.uuid;
  }
}
