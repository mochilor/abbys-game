import { GameItem } from '../../GameItem/types';
import GameObject from '../GameObject';
import { tintShallow } from './tint';

export default class SeaWeed extends GameObject {
  public static key = 'SeaWeed';

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);

    // x and y offset!
    this.x += 4;
    this.y -= 4;

    scene.anims.create({
      key: 'seaweed',
      frameRate: 12,
      frames: this.anims.generateFrameNames(
        'sprites',
        {
          prefix: 'seaweed_',
          end: 7,
        },
      ),
      repeat: -1,
    });

    this.play({
      key: 'seaweed',
      startFrame: Math.floor(Math.random() * 8),
    });

    tintShallow(this, gameItem.roomName);

    this.setDepth(-1);
  }
}
