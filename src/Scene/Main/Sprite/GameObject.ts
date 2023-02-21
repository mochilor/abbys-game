import GameItem from '../GameItem/GameItemInterface';

export default abstract class GameObject extends Phaser.GameObjects.Sprite {
  public static key: string;

  private uuid: string;

  protected properties: GameItem['properties'] = [];

  protected gameItem: GameItem;

  // Don't add type here to prevent crash on code coverage
  public body;

  constructor(
    scene: Phaser.Scene,
    gameItem: GameItem,
    texture: string,
  ) {
    super(scene, gameItem.x, gameItem.y, texture);
    scene.add.existing(this);
    this.uuid = gameItem.uuid;
    this.properties = gameItem.properties;
    this.gameItem = gameItem;
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
