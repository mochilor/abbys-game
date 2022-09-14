import Phaser from 'phaser';
import EventDispatcher from '../../../../Service/EventDispatcher';
import { GameItem } from '../../GameItem/Interfaces';
import GameObject from '../GameObject';

export default class Door extends GameObject {
  public static key = 'Door';

  private level: number;

  private locks: Phaser.GameObjects.Rectangle[] = [];

  private coinCounter: number = 0;

  private isOpen: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, uuid: string, level: GameItem['properties'][number]) {
    super(scene, x, y, 'blocksImage', uuid);

    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.body.setImmovable();

    this.level = level.value as number;

    this.setupLocks(scene);

    EventDispatcher.getInstance().on('getCoin', this.unlock, this);
  }

  private setupLocks(scene: Phaser.Scene): void {
    const topLeft = this.getTopLeft();
    let x = topLeft.x + 4;
    let y = topLeft.y + 4;
    for (let n = 0; n < this.level; n += 1) {
      this.locks.push(scene.add.rectangle(x, y, 2, 2, 0x222222));
      x += 4;
    }
  }

  // TODO: store in savegame current level for each door
  private unlock(): void {
    if (this.isOpen) {
      return;
    }

    this.coinCounter += 1;

    this.locks[this.coinCounter - 1].setFillStyle(0xffffff);

    if (this.coinCounter >= this.level) {
      // cool animation here!
      this.isOpen = true;
    }
  }

  public open(): void {
    if (!this.isOpen) {
      return;
    }

    // Add animation here!
    for (let n = 0; n < this.locks.length; n += 1) {
      this.locks[n].destroy();
      delete this.locks[n];
    }

    this.destroy(); // take care of references to free memory!
  }
}
