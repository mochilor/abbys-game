import config from '../../../config/config.json';

export default function progressBar(scene: Phaser.Scene): void {
  const boxWidth = 75;
  const boxOriginX = (config.gameWidth / 2) - (boxWidth / 2);

  const boxHeight = 8;
  const boxOriginY = (config.gameHeight / 2) - (boxHeight / 2);

  const boxBorderWidth = 1;

  const box = scene.add.graphics();
  box.fillStyle(0x222222);
  box.fillRect(
    boxOriginX,
    boxOriginY,
    boxWidth,
    boxHeight,
  );

  const bar = scene.add.graphics();

  scene.load.on('progress', (value: number) => {
    const barWidth = boxWidth - (boxBorderWidth * 2);
    const barHeight = boxHeight - (boxBorderWidth * 2);

    bar.clear();
    bar.fillStyle(0xffffff, 0.5);
    bar.fillRect(
      boxOriginX + boxBorderWidth,
      boxOriginY + boxBorderWidth,
      barWidth * value,
      barHeight,
    );
  });

  scene.load.on('complete', () => {
    bar.destroy();
    box.destroy();
  });
}
