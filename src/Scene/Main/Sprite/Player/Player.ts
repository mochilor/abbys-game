import Phaser from 'phaser';
import Door from '../Dynamic/Door';
import Backpack from './Backpack';
import { Controller, PlayerDirections } from './Controller';
import EventDispatcher from '../../../../Service/EventDispatcher';
import GameSprite from '../GameSpriteInterface';
import Spike from '../Static/Spike';
import GameObject from '../GameObject';

export default class Player extends GameObject implements GameSprite {
  public static key = 'Player';

  public static texture: string = 'player';

  private controller: Controller;

  private hasFeet: boolean = false;

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
    EventDispatcher.getInstance().on('playerGotFeet', this.playerGotFeet, this);
  }

  update() {
    const baseVelocityX: number = 100;
    const baseVelocityY: number = 100;

    const directions: PlayerDirections = this.controller.move();

    this.body.setVelocityX(baseVelocityX * directions.directionX);

    if (directions.directionY && this.canJump()) {
      this.body.setMaxVelocityY(100);
      this.body.setVelocityY(baseVelocityY * directions.directionY);
    }
  }

  private canJump(): boolean {
    return this.hasFeet && this.body.blocked.down;
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

  private playerGotFeet(): void {
    this.hasFeet = true;
  }
}
