import GameObject from '../../GameObject';
import GameSprite from '../../GameSpriteInterface';
import GameItem from '../../../GameItem/GameItemInterface';
import RoomName from '../../../Map/RoomName';

export default abstract class Fish extends GameObject implements GameSprite {
  protected orientation: number;

  protected speed: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    roomName: RoomName,
    uuid: string,
    properties: GameItem['properties'],
    texture: string,
    depth: integer,
  ) {
    super(scene, x + 4, y - 4, texture, uuid, properties);
    scene.add.existing(this);

    this.orientation = this.getProperty('orientation')?.value as number ?? 1;

    this.speed = this.getProperty('speed')?.value as number ?? 0.2;

    this.setDepth(depth);

    const key = `fish-${texture}`;

    scene.anims.create({
      key,
      frameRate: this.speed * 60,
      frames: texture,
      repeat: -1,
    });

    this.play(key);
  }

  public abstract update(): void;
}
