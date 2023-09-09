import { GameItem } from '../../GameItem/types';
import GameObject from '../GameObject';

export default class PortalDestination extends GameObject {
  public static key = 'PortalDestination';

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);

    this.setFrame('portal_1');
  }
}
