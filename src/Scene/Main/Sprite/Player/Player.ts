import Phaser from 'phaser';
import Door from '../Dynamic/Door';
import Backpack from './Backpack';
import Controller from './Controller';
import EventDispatcher from '../../../../Service/EventDispatcher';
import GameSprite from '../GameSpriteInterface';
import Spike from '../Static/Spike';
import GameObject from '../GameObject';
import Button from '../Dynamic/Button';
import config from '../../../../../config/config.json';
import Portal from '../Static/Portal';
import Bubble from './Bubble';
import Spring from '../Static/Spring';
import SpikePlatform from '../Static/SpikePlatform';

export default class Player extends GameObject implements GameSprite {
  public static key = 'Player';

  private controller: Controller;

  private backpack: Backpack;

  private portalDestination: { x: number, y: number };

  private bubbles: Bubble[];

  private jumpTimer: number = 0;

  private isJumping: boolean = false;

  private jumpSpeed: number = 80;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    controller: Controller,
    backpack: Backpack,
  ) {
    super(scene, x, y, 'playerSpritesheet');
    scene.physics.world.enable(this);
    scene.add.existing(this);
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
      new Bubble(scene, x, y),
      new Bubble(scene, x, y),
    ];
  }

  update() {
    const baseVelocityX: number = 100;

    const direction = this.controller.move();

    this.body.setVelocityX(baseVelocityX * direction);

    if (direction !== 0) {
      this.play('playerWalk', true);
      this.flipX = direction < 0;
    } else {
      this.setFrame(0);
    }

    if (!this.body.blocked.down) {
      this.setFrame(7);
    }

    this.bubbles.forEach((bubble) => bubble.update(this.x, this.y));

    if (this.isJumping) {
      this.jump();
    }
  }

  public collectItem(player: this, item: GameObject) {
    if (item instanceof Portal) {
      this.setPortalDestination(item.getDestination().x, item.getDestination().y);
      EventDispatcher.getInstance().emit(
        'newRoomReached',
        item.getDestination().room,
        item.getRoomName(),
        this,
      );
      return;
    }

    this.backpack.addItem(item);
  }

  public touchSpring(player: this, item: Spring): void {
    if (!item.body.touching.up) {
      return;
    }

    if (!item.isActive()) {
      item.activate();
      this.isJumping = true;
      this.jumpTimer = 0;
    }
  }

  private jump(): void {
    this.jumpTimer += 1;
    this.setFrame(8);

    if (this.jumpTimer < 15) {
      this.body.velocity.y = -this.jumpSpeed;
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
    if (player.body.embedded) {
      // This happens when the player moves touches a spike while over a moving platform
      player.die();
    }

    if (
      (player.body.touching.down && spike.isFacingUp() && spike.body.touching.up)
      || (player.body.touching.right && spike.isFacingLeft() && spike.body.touching.left)
      || (player.body.touching.up && spike.isFacingDown() && spike.body.touching.down)
      || (player.body.touching.left && spike.isFacingRight() && spike.body.touching.right)
    ) {
      player.die();
    }
  }

  public touchSpikePlatform(player: this, spikePlatform: SpikePlatform): void {
    if (player.body.touching.up && spikePlatform.body.touching.down) {
      player.die();
    }
  }

  private die(): void {
    EventDispatcher.getInstance().emit('playerHasDied');
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
}
