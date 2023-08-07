import config from '../../../../config/config.json';
import { PauseButton } from './types';

export default function createPauseButton(scene: Phaser.Scene): PauseButton {
  const margin = 16;

  function pause(): void {
    scene.scene.pause();
    scene.scene.launch('Pause');
  }

  const x = config.gameWidth - margin;
  const y = margin;
  const width = 20;

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
  graphics.lineStyle(2, 0xffffff, 1);

  const bodyX = x - (width / 2);
  const bodyY = y - (width / 2);

  const stroke = graphics.strokeRect(bodyX, bodyY, width, width);
  stroke.setScrollFactor(0);

  const pauseSymbol = scene.add.bitmapText(x, y, 'font', '|')
    .setOrigin(0.5, 0.4)
    .setDepth(2)
    .setScrollFactor(0);

  function hide(): void {
    stroke.setVisible(false);
    pauseSymbol.setVisible(false);
    body.disableInteractive();
  }

  function show(): void {
    stroke.setVisible(true);
    pauseSymbol.setVisible(true);
    body.setInteractive();
  }

  return { pause, hide, show };
}
