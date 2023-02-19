import GameItem from '../../GameItem/GameItemInterface';
import RoomName from '../../Map/RoomName';
import Fish from './Fish';
import { tintShallow } from './tint';

export default class BigFish extends Fish {
  public static key = 'BigFish';

  private fromX: number;

  private toX: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    uuid: string,
    properties: GameItem['properties'],
    roomName: RoomName,
  ) {
    super(scene, x, y, roomName, uuid, properties, 'bigFishSpritesheet', -1);

    this.speed = this.getProperty('speed')?.value as number ?? 0.3;

    const offset = 4;
    const distanceProperty = this.getProperty('distance');
    const distance = distanceProperty ? parseInt(distanceProperty.value as string, 10) : 100;

    if (distance <= 0) { // to the left
      this.orientation = -1;
      this.fromX = x + distance;
      this.toX = x + offset;
    } else {
      this.orientation = 1;
      this.fromX = x + offset;
      this.toX = x + distance;
    }

    tintShallow(this, roomName);
  }

  public update(): void {
    this.flipX = this.orientation < 0;
    this.x -= (this.speed * this.orientation);
    if (this.x < this.fromX || this.x > this.toX) {
      this.orientation *= -1;
    }
  }
}
