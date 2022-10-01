import GameItem from '../GameItem/GameItemInterface';

export default abstract class GameObject extends Phaser.GameObjects.Sprite {
  public static key: string;

  private uuid: string;

  private roomName: string;

  protected properties: GameItem['properties'] = [];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    roomName: string = '',
    uuid: string = '',
    properties: GameItem['properties'] = [],
  ) {
    super(scene, x, y, texture);
    this.roomName = roomName;
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

  public getRoomName(): string {
    return this.roomName;
  }
}
