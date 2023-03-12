import { GameItem } from '../../GameItem/types';
import Fish from './Fish';
import config from '../../../../../config/config.json';
import { tintDeep } from './tint';

export default class SmallFish extends Fish {
  public static key = 'SmallFish';

  private verticalSpeed: number;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'smallFishSpritesheet', -100);

    this.verticalSpeed = this.getProperty('verticalSpeed')?.value as number ?? 0.07 * (Math.random() - 0.5);

    tintDeep(this, gameItem.roomName);
  }

  public update(): void {
    this.flipX = this.orientation < 0;
    this.x -= (this.speed * this.orientation);
    this.y += this.verticalSpeed;
    if (this.x < 0 || this.x > config.roomWidth) {
      this.orientation *= -1;
    }
  }
}
