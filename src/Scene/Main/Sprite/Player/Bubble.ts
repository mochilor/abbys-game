type Bubble = {
  update(playerX: number, playerY: number): void;
};

function createBubble(scene: Phaser.Scene, x: number, y: number): Bubble {
  let life: integer = 0;
  let resetAt: integer = 100;
  let timer: integer = 0;
  const bubble = scene.add.rectangle(x, y, 1, 1, 0xeeeeee, 0.5);
  bubble.setVisible(false);

  function setLife(): void {
    life = 100 + Math.round(150 * Math.random());
  }

  function setResetTime(): void {
    resetAt = life + Math.round(200 * Math.random());
  }

  setLife();
  setResetTime();

  function respawn(playerX: number, playerY: number): void {
    timer = 0;
    bubble.setVisible(true);
    bubble.setX(playerX);
    bubble.setY(playerY - 12);
    setLife();
    setResetTime();
  }

  function update(playerX: number, playerY: number) {
    bubble.setY(bubble.y - 0.2);
    bubble.setX(bubble.x + (Math.sin(timer / 6) / 4));

    timer += 1;

    if (timer >= life) {
      bubble.setVisible(false);
    }

    if (timer >= resetAt) {
      respawn(playerX, playerY);
    }
  }

  return { update };
}

export { Bubble, createBubble };
