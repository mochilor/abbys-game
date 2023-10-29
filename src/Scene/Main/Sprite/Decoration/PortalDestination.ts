import { GameItem } from '../../GameItem/types';
import GameObject from '../GameObject';

export default class PortalDestination extends GameObject {
  public static key = 'PortalDestination';

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);

    scene.anims.create({
      key: 'portal_off',
      frameRate: 16,
      frames: this.anims.generateFrameNames(
        'sprites',
        {
          prefix: 'portal_',
          start: 8,
          end: 15,
        },
      ),
      repeat: -1,
    });

    this.play('portal_off');
  }
}
