import Phaser from 'phaser';
import GameItem from '../../GameItem/GameItemInterface';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Button extends GameObject implements GameSprite {
  public static key = 'Button';

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    roomName: string,
    uuid: string,
    properties: GameItem['properties'],
  ) {
    super(scene, x, y, 'objects', roomName, uuid, properties);

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setImmovable();
    this.body.setSize(8, 2);
    this.body.setOffset(0, 6);

    this.setFrame(10);
  }

  public getEventName(): string {
    return `button${this.getProperty('event').value}Activated`;
  }
}
