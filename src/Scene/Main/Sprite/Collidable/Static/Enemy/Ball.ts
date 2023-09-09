import { GameItem } from '../../../../GameItem/types';
import EnemyGameObject from './EnemyGameObject';

export default class Ball extends EnemyGameObject {
  private radius: integer;

  private ballAngle: number;

  private angleV: number = 0;

  private angleA: number = 0;

  private startingX: number;

  private startingY: number;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem);
    this.setFrame('ball');

    this.radius = parseInt(this.getProperty('radius')?.value as string ?? '0', 10);

    scene.physics.world.enable(this);
    this.body.setImmovable();
    this.ballAngle = Math.PI * 0.8;
    this.startingX = this.x;
    this.startingY = this.y;
    // this.setOrigin();
  }

  public update(): void {
    if (this.radius === 0) {
      return;
    }

    // // https://editor.p5js.org/codingtrain/sketches/SN-39sHAC

    const force: number = -Math.sin(this.ballAngle) / 18;
    this.angleA = force / this.radius;
    this.angleV += this.angleA;
    this.ballAngle += this.angleV;

    this.x = this.radius * Math.sin(this.ballAngle) + this.startingX;
    this.y = this.radius * Math.cos(this.ballAngle) + this.startingY;
  }
}
