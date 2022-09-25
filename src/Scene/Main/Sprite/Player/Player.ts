import Phaser from 'phaser';
import Door from '../Dynamic/Door';
import Backpack from './Backpack';
import { Controller, PlayerDirections } from './Controller';
import EventDispatcher from '../../../../Service/EventDispatcher';
import GameSprite from '../GameSpriteInterface';
import Spike from '../Static/Spike';
import GameObject from '../GameObject';
import Button from '../Dynamic/Button';
import Platform from '../Static/Platform';

export default class Player extends GameObject implements GameSprite {
  public static key = 'Player';

  public static texture: string = 'player';

  private controller: Controller;

  private hasFeet: boolean = false;

  private backpack: Backpack;

  private jumpTimer: number = 0;

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
    this.body.setSize(13, 15);
    this.body.setOffset(1, 1);
  }

  update() {
    const baseVelocityX: number = 100;
    const baseVelocityY: number = 50;

    const directions: PlayerDirections = this.controller.move();

    this.body.setVelocityX(baseVelocityX * directions.directionX);

    if (directions.directionY) {
      if (this.canJump()) {
        this.jumpTimer = 1;
        this.body.setVelocityY(baseVelocityY * directions.directionY);
      } else if (this.jumpTimer > 0 && this.jumpTimer < 10) {
        this.jumpTimer += 1;
        this.body.setVelocityY((baseVelocityY + (this.jumpTimer * 10)) * directions.directionY);
      }
    } else {
      this.jumpTimer = 0;
    }
  }

  private canJump(): boolean {
    return this.hasFeet && this.body.blocked.down && this.jumpTimer === 0;
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

  public activateButton(player: Player, button: Button): void {
    if (button.body.touching.up) {
      this.backpack.addItem(button);
    }
  }

  public touchSpike(player: this, spike: Spike): void {
    if (
      (player.body.touching.down && spike.isFacingUp())
      || (player.body.touching.right && spike.isFacingLeft())
      || (player.body.touching.up && spike.isFacingDown())
      || (player.body.touching.left && spike.isFacingRight())
    ) {
      player.die();
    }
  }

  public die(): void {
    EventDispatcher.getInstance().emit('playerHasDied');
  }

  public gotFeet(): void {
    this.hasFeet = true;
  }

  public initBackpack(): void {
    this.backpack.init();
  }

  public touchPlatform(player: Player, platform: Platform): void {
    if (platform.body.touching.up) {
      player.body.setVelocityY(Math.abs(platform.getSpeed()));
    }
  }
}
