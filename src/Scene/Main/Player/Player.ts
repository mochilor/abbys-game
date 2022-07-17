import Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Sprite {
  public static texture: string = 'player';

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.physics.world.enable(this);
    scene.add.existing(this);
  }
}
