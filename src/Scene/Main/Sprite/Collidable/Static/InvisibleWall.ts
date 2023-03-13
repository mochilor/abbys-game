import { GameItem } from '../../../GameItem/types';
import GameObject from '../../GameObject';

export default class InvisibleWall extends GameObject {
  public static key = 'InvisibleWall';

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'conveyorSpriteSheet');

    scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);

    this.setVisible(false);
    this.body.setSize(8, 8);
  }
}
