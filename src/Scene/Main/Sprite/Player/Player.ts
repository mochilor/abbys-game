import Phaser from 'phaser';
import Door from '../GameObject/Door';
import Backpack from './Backpack';
import { Controller, PlayerVelocity } from './Controller';
import EventDispatcher from '../../../../Service/EventDispatcher';

export default class Player extends Phaser.GameObjects.Sprite {
  public static key = 'Player';

  public static texture: string = 'player';

  private controller: Controller;

  private canJump: boolean = false;

  private backpack: Backpack;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    controller: Controller,
    backpack: Backpack,
  ) {
    super(scene, x, y, 'player');
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.controller = controller;
    this.backpack = backpack;
    this.setOrigin();
    this.body.setMaxVelocityY(80);
    this.body.setGravityY(100);
  }

  update() {
    const baseVelocityX: number = 100;
    const baseVelocityY: number = 80;
    const velocity: PlayerVelocity = this.controller.move();
    this.body.setVelocityX(baseVelocityX * velocity.velocityX);
    if (velocity.velocityY && this.canJump) {
      this.body.setVelocityY(baseVelocityY * velocity.velocityY);
    }
  }

  public positionInRoom(roomX: number, roomY: number): { x: number, y: number } {
    return {
      x: this.x - roomX,
      y: this.y - roomY,
    };
  }

  public collectItem(player: this, item: Phaser.GameObjects.Sprite) {
    this.backpack.addItem(item);
  }

  public openDoor(player: Player, door: Door): void {
    door.open();
  }

  public die(): void {
    EventDispatcher.getInstance().emit('playerHasDied');
  }
}
