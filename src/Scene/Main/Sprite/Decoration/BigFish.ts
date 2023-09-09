import { GameItem } from '../../GameItem/types';
import Fish from './Fish';
import { tintShallow } from './tint';

export default class BigFish extends Fish {
  public static key = 'BigFish';

  private fromX: number;

  private toX: number;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'big', -1);

    this.speed = this.getProperty('speed')?.value as number ?? 0.3;

    const distanceProperty = this.getProperty('distance');
    const distance = distanceProperty ? parseInt(distanceProperty.value as string, 10) : 100;

    if (distance <= 0) { // to the left
      this.orientation = -1;
      this.fromX = this.x + distance;
      this.toX = this.x;
    } else {
      this.orientation = 1;
      this.fromX = this.x;
      this.toX = this.x + distance;
    }

    tintShallow(this, gameItem.roomName);
  }

  public update(): void {
    this.flipX = this.orientation < 0;
    this.x -= (this.speed * this.orientation);
    if (this.x < this.fromX || this.x > this.toX) {
      this.orientation *= -1;
    }
  }
}
