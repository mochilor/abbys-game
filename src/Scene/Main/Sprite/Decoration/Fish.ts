import GameObject from '../GameObject';
import GameItem from '../../GameItem/GameItemInterface';

export default abstract class Fish extends GameObject {
  protected orientation: number;

  protected speed: number;

  constructor(scene: Phaser.Scene, gameItem: GameItem, texture: string, depth: integer) {
    super(scene, gameItem, texture);
    this.x += 4;
    this.y -= 4;

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
