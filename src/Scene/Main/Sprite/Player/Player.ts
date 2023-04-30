import Phaser from 'phaser';
import Door from '../Collidable/Dynamic/Door';
import Backpack from './Backpack';
import * as EventDispatcher from '../../../../Service/EventDispatcher';
import Spike from '../Collidable/Static/Spike';
import GameObject from '../GameObject';
import Button from '../Collidable/Dynamic/Button';
import config from '../../../../../config/config.json';
import Portal from '../Collidable/Static/Portal';
import { Bubble, createBubble } from './Bubble';
import Spring from '../Collidable/Static/Spring';
import { Controller } from './controller';
import SpikePlatform from '../Collidable/Static/SpikePlatform';
import Conveyor from '../Collidable/Static/Conveyor';
import { GameItem } from '../../GameItem/types';

export default class Player extends GameObject {
  public static key = 'Player';

  private controller: Controller;

  private backpack: Backpack;

  private portalDestination: { x: number, y: number };

  private bubbles: Bubble[];

  private jumpTimer: number = 0;

  private isJumping: boolean = false;

  private jumpSpeed: number = 80;

  private conveyor: Conveyor = null;

  private frozen: boolean = true;

  constructor(
    scene: Phaser.Scene,
    gameItem: GameItem,
    controller: Controller,
    backpack: Backpack,
  ) {
    super(scene, gameItem, 'playerSpritesheet');
    scene.physics.world.enable(this);
    this.controller = controller;
    this.backpack = backpack;
    this.body.setMaxVelocityY(80);
    this.body.setGravityY(100);
    this.body.setSize(10, 21);

    this.setFrame(0);

    scene.anims.create({
      key: 'playerWalk',
      frameRate: 12,
      frames: this.anims.generateFrameNumbers('playerSpritesheet', { start: 1, end: 6 }),
      repeat: -1,
    });

    this.bubbles = [
      createBubble(scene, this.x, this.y),
      createBubble(scene, this.x, this.y),
    ];
  }

  update() {
    this.bubbles.forEach((bubble) => bubble.update(this.x, this.y));

    if (this.frozen) {
      return;
    }

    const baseVelocityX: number = 100;

    const direction = this.controller.move();

    let velocityX = baseVelocityX * direction;

    if (this.conveyor) {
      velocityX += this.conveyor.speed();
    }

    this.body.setVelocityX(velocityX);

    if (direction !== 0) {
      this.play('playerWalk', true);
      this.setFlipX(direction < 0);
    } else {
      this.setFrame(0);
    }

    if (!this.body.blocked.down) {
      this.setFrame(7);
    }

    if (this.isJumping) {
      this.jump();
    }

    this.conveyor = null;
  }

  public collectItem(player: this, item: GameObject) {
    if (item instanceof Portal) {
      this.setPortalDestination(item.getDestination().x, item.getDestination().y);
      EventDispatcher.emit(
        'newRoomReached',
        item.getDestination().room,
        item.getRoomName(),
        this,
      );
      return;
    }

    this.backpack.addItem(item);
  }

  public touchSpring(player: this, spring: Spring): void {
    if (!spring.body.touching.up) {
      return;
    }

    if (!spring.isActive()) {
      spring.activate();
      this.isJumping = true;
      this.jumpTimer = 0;
    }
  }

  private jump(): void {
    this.jumpTimer += 1;
    this.setFrame(8);

    if (this.jumpTimer < 15) {
      this.body.setVelocityY(-this.jumpSpeed);
    }

    if (this.jumpTimer > 40) {
      this.jumpTimer = 0;
      this.isJumping = false;
    }
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
    const playerTouching = player.body.touching;
    const spikeTouching = spike.body.touching;

    if (
      (playerTouching.down && spike.isFacingUp() && spikeTouching.up)
      || (playerTouching.right && spike.isFacingLeft() && spikeTouching.left)
      || (playerTouching.up && spike.isFacingDown() && spikeTouching.down)
      || (playerTouching.left && spike.isFacingRight() && spikeTouching.right)
    ) {
      player.die();
    }
  }

  public touchSpikePlatform(player: this, spikePlatform: SpikePlatform): void {
    if (player.body.touching.up && spikePlatform.body.touching.down) {
      player.die();
    }
  }

  public touchConveyor(player: this, conveyor: Conveyor): void {
    if (player.body.touching.down && conveyor.body.touching.up) {
      player.conveyor = conveyor;
    }
  }

  private die(): void {
    EventDispatcher.emit('playerHasDied');
  }

  public initBackpack(): void {
    this.backpack.init();
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
    } else if (this.isTeleporting()) {
      x = this.portalDestination.x;
    }

    let { y } = this;
    if (this.isLeavingRoomTop()) {
      y = config.roomHeight;
    } else if (this.isLeavingRoomBottom()) {
      y = 0;
    } else if (this.isTeleporting()) {
      y = this.portalDestination.y;
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

  public setPortalDestination(x: number, y: number): void {
    this.portalDestination = { x, y };
  }

  private isTeleporting(): boolean {
    return this.portalDestination != null;
  }

  public unfreeze(): void {
    this.frozen = false;
  }

  private freeze(): void {
    this.frozen = true;
    this.setFrame(0);
    this.body.setVelocityX(0);
    this.anims.stop();
  }

  public prepareToEnding(): void {
    this.freeze();
    this.setDepth(10);
  }
}
