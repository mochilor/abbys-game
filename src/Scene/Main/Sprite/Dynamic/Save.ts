import Phaser from 'phaser';
import EventDispatcher from '../../../../Service/EventDispatcher';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Save extends GameObject implements GameSprite {
  public static key = 'Save';

  constructor(scene: Phaser.Scene, x: number, y: number, uuid: string) {
    super(scene, x, y, 'objects', uuid);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.setFrame(7);

    EventDispatcher.getInstance().on('newRoomReached', this.resetBody, this);
  }

  private resetBody() {
    this.body.enable = true;
    this.visible = true;
  }
}
