import GameItem from '../../GameItem/GameItemInterface';
import RoomName from '../../Map/RoomName';
import GameObject from '../GameObject';
import GameSprite from '../GameSpriteInterface';

export default class Conveyor extends GameObject implements GameSprite {
  public static key = 'Conveyor';

  private direction: integer;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    roomName: RoomName,
    uuid: string,
    properties: GameItem['properties'],
  ) {
    super(scene, x, y, 'conveyorSpriteSheet', roomName, uuid, properties);

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setImmovable();

    this.direction = this.getProperty('reverse')?.value ? -1 : 1;

    const frameRate = 36;

    scene.anims.create({
      key: 'conveyor-wheel-left',
      frames: this.anims.generateFrameNumbers('conveyorSpriteSheet', { start: 0, end: 3 }),
      frameRate,
      repeat: -1,
    });

    scene.anims.create({
      key: 'conveyor-center',
      frames: this.anims.generateFrameNumbers('conveyorSpriteSheet', { start: 4, end: 7 }),
      frameRate,
      repeat: -1,
    });

    scene.anims.create({
      key: 'conveyor-wheel-right',
      frames: this.anims.generateFrameNumbers('conveyorSpriteSheet', { start: 8, end: 11 }),
      frameRate,
      repeat: -1,
    });
  }

  public setup(previousConveyor: Conveyor | null, nextConveyor: Conveyor | null): void {
    let animationKey = 'conveyor-center';

    if (
      !previousConveyor
      || previousConveyor.x < this.x - this.width
      || previousConveyor.y !== this.y
      || (this.direction !== previousConveyor.direction)
    ) {
      animationKey = 'conveyor-wheel-left';
    } else if (
      !nextConveyor
      || nextConveyor.x > this.x + this.width
      || nextConveyor.y !== this.y
      || (this.direction !== nextConveyor.direction)
    ) {
      animationKey = 'conveyor-wheel-right';
    }

    if (this.direction > 0) {
      this.play(animationKey);
      return;
    }

    this.playReverse(animationKey);
  }

  public speed(): integer {
    return this.direction * 50;
  }
}
