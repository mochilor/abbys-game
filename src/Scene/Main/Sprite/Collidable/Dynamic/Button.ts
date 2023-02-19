import Phaser from 'phaser';
import GameItem from '../../../GameItem/GameItemInterface';
import GameObject from '../../GameObject';

export default class Button extends GameObject {
  public static key = 'Button';

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    uuid: string,
    properties: GameItem['properties'],
  ) {
    super(scene, x, y, 'objects', uuid, properties);

    scene.physics.world.enable(this);
    this.body.setImmovable();
    this.body.setSize(8, 2);
    this.body.setOffset(0, 6);

    this.setFrame(7);
  }

  public getEventName(): string {
    return `button${this.getProperty('event').value}Activated`;
  }
}
