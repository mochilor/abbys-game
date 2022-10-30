export default class Bubble {
  private bubble: Phaser.GameObjects.Rectangle;

  private timer: number = 0;

  private resetAt: number = 100;

  private life: number = 100;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.bubble = scene.add.rectangle(x, y, 1, 1, 0xeeeeee, 0.5);
    this.bubble.setVisible(false);
    this.setLife();
    this.setResetTime();
  }

  private setLife(): void {
    this.life = 100 + Math.round(150 * Math.random());
  }

  private setResetTime(): void {
    this.resetAt = this.life + Math.round(200 * Math.random());
  }

  public update(playerX: number, playerY: number) {
    this.bubble.setY(this.bubble.y - 0.2);
    this.bubble.setX(this.bubble.x + (Math.sin(this.timer / 6) / 4));

    this.timer += 1;

    if (this.timer >= this.life) {
      this.bubble.setVisible(false);
    }

    if (this.timer >= this.resetAt) {
      this.respawn(playerX, playerY);
    }
  }

  private respawn(playerX: number, playerY: number): void {
    this.timer = 0;
    this.bubble.setVisible(true);
    this.bubble.setX(playerX);
    this.bubble.setY(playerY - 12);
    this.setLife();
    this.setResetTime();
  }
}
