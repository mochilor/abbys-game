import GameItem from '../../GameItem/GameItemInterface';
import RoomName from '../../Map/RoomName';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class SpikePlatform extends GameObject implements GameSprite {
  public static key = 'SpikePlatform';

  private speed: number = 25;

  private stopLength: number;

  private isFalling: boolean;

  private restartTime: number;

  private startTime: number = 0;

  private delay: number;

  private startAt: number = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    roomName: RoomName,
    uuid: string,
    properties: GameItem['properties'],
  ) {
    super(scene, x, y + 2, 'spikePlatformImage', roomName, uuid, properties);

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setImmovable();

    this.body.setSize(32, 16);
    this.body.setOffset(0, 4);

    this.maxHeight = y - 64;
    this.isFalling = false;
    this.restartTime = 3500;
    this.body.setGravityY(0);

    this.delay = this.getProperty('delay') ? this.getProperty('delay').value as number : 0;
    this.stopLength = this.getProperty('stopLength')?.value as number ?? 0;
  }

  public update(time: number): void {
    if (this.startAt === null) {
      this.startAt = time;
    }

    if (this.delay > 0 && time - this.startAt < this.delay) {
      return;
    }

    if (!this.body.blocked.up && !this.isFalling) {
      this.body.setVelocityY(-this.speed);
      return;
    }

    if (this.startTime === 0) {
      this.startTime = time;
    }

    const delta = time - this.startTime;

    if (delta > this.stopLength) {
      this.isFalling = true;
      this.body.setGravityY(300);
    }

    if (delta > this.restartTime) {
      this.isFalling = false;
      this.startTime = 0;
      this.body.setGravityY(0);
    }
  }
}
