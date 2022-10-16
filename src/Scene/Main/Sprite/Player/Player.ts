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
import config from '../../../../../config/config.json';
import EnemyGameObject from '../Static/Enemy/EnemyGameObject';

export default class Player extends GameObject implements GameSprite {
  public static key = 'Player';

  public static texture: string = 'player';

  private controller: Controller;

  private hasFeet: boolean = true;

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

  public collectItem(player: this, item: GameObject) {
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

  private die(): void {
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

  public getBackpack(): Backpack {
    return this.backpack;
  }

  public isLeavingRoom(): boolean {
    return this.isLeavingRoomLeft()
      || this.isLeavingRoomTop()
      || this.isLeavingRoomRight()
      || this.isLeavingRoomBottom();
  }

  public isLeavingRoomLeft(): boolean {
    return this.x < 0;
  }

  public isLeavingRoomTop(): boolean {
    return this.y < 0;
  }

  public isLeavingRoomRight(): boolean {
    return this.x > config.roomWidth;
  }

  public isLeavingRoomBottom(): boolean {
    return this.y > config.roomHeight;
  }

  public getPositionInNewRoom(): { x: number, y: number } {
    let { x } = this;
    if (this.isLeavingRoomLeft()) {
      x = config.roomWidth;
    } else if (this.isLeavingRoomRight()) {
      x = 0;
    }

    let { y } = this;
    if (this.isLeavingRoomTop()) {
      y = config.roomHeight;
    } else if (this.isLeavingRoomBottom()) {
      y = 0;
    }

    return { x, y };
  }

  public setVelocityY(velocityY: number): void {
    this.body.velocity.y = velocityY;
  }

  public getController(): Controller {
    return this.controller;
  }

  public touchEnemy(): void {
    this.die();
  }
}
