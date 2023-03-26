import createMenu from '../../UI/Menu';
import config from '../../../config/config.json';
import createButton from '../../UI/Button';
import { getSettings } from '../../Service/Settings';
import * as EventDispatcher from '../../Service/EventDispatcher';
import { Button } from '../../UI/types';

export default class Pause extends Phaser.Scene {
  private soundButton: Button;

  constructor() {
    super({ key: 'Pause' });
  }

  public preload(): void {
    this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.75)');
  }

  public create(): void {
    const menu = createMenu(
      config.gameWidth / 2,
      config.gameHeight / 3,
      this,
      'PAUSED\n \n',
    );

    this.soundButton = createButton(
      0,
      0,
      this,
      this.getSoundButtonText(),
      true,
      this.toggleSound,
    );

    const continueButton = createButton(
      0,
      0,
      this,
      'Continue',
      true,
      this.continue,
    );

    const cancelButton = createButton(
      0,
      0,
      this,
      'Exit game',
      true,
      this.quit,
    );

    menu.addButton(...this.soundButton.contents());
    menu.addButton(...continueButton.contents());
    menu.addButton(...cancelButton.contents());

    menu.show();

    const escapeKey = this.input.keyboard.addKey('ESC');
    escapeKey.on('down', this.continue, this);
  }

  private continue(): void {
    this.scene.resume('Main');
    this.scene.stop();
  }

  private quit(): void {
    this.registry.reset();
    this.registry.set('start', true);
    this.scene.start('Main', {});
  }

  private getSoundButtonText(): string {
    const soundCharacters = {
      0: '<',
      1: '>',
    };

    return `Sound ${soundCharacters[+getSettings().audio]}`;
  }

  private toggleSound(): void {
    EventDispatcher.emit('soundToggled');
    const text = this.soundButton.contents()[1];
    text.text = this.getSoundButtonText();
  }
}
