import config from '../../../../config/config.json';
import { PauseButton } from './types';

export default function createPauseButton(scene: Phaser.Scene): PauseButton {
  const margin = 15;

  function pause(): void {
    scene.scene.pause();
    scene.scene.launch('Pause');
  }

  const x = config.gameWidth - margin;
  const y = margin;
  const width = 16;

  const body = scene.add.rectangle(
    x,
    y,
    width,
    width,
  );
  body.setScrollFactor(0);
  body.setInteractive({ useHandCursor: true });
  body.on('pointerdown', () => pause.apply(scene, []));

  const graphics = scene.add.graphics();
  graphics.lineStyle(1, 0xffffff, 1);

  const bodyX = x - (width / 2);
  const bodyY = y - (width / 2);

  const stroke = graphics.strokeRect(bodyX, bodyY, width, width);
  stroke.setScrollFactor(0);

  scene.add.bitmapText(x, y, 'font', '|')
    .setOrigin(0.5, 0.4)
    .setDepth(2)
    .setScrollFactor(0);

  return { pause };
}
