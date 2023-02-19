import GameItem from '../GameItem/GameItemInterface';

export default abstract class GameObject extends Phaser.GameObjects.Sprite {
  public static key: string;

  private uuid: string;

  protected properties: GameItem['properties'] = [];

  // Don't add type here to prevent crash on code coverage
  public body;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    uuid: string = '',
    properties: GameItem['properties'] = [],
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    this.uuid = uuid;
    this.properties = properties;
  }

  protected getProperty(name: string): GameItem['properties'][number] | null {
    for (let n = 0; n < this.properties.length; n += 1) {
      if (this.properties[n].name === name) {
        return this.properties[n];
      }
    }

    return null;
  }

  public getUuid(): string {
    return this.uuid;
  }
}
