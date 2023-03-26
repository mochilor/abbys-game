import config from '../../../../config/config.json';
import createButton from '../../../UI/Button';
import { PauseButton } from './types';

export default function createPauseButton(scene: Phaser.Scene): PauseButton {
  const margin = 15;

  function pause(): void {
    scene.scene.pause();
    scene.scene.launch('Pause');
  }

  createButton(
    config.gameWidth - margin,
    margin,
    scene,
    '|',
    true,
    pause,
    17,
  );

  return { pause };
}
