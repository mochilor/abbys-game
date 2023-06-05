import { GameItem } from '../../GameItem/types';
import GameObject from '../GameObject';
import { tintText } from './tint';

export default class TextSprite extends GameObject {
  public static key = 'Text';

  private text: Phaser.GameObjects.BitmapText;

  constructor(scene: Phaser.Scene, gameItem: GameItem) {
    super(scene, gameItem, 'conveyorSpriteSheet');

    this.setVisible(false);

    const wording = this.getProperty('text')?.value as string ?? '';

    this.text = scene.add.bitmapText(gameItem.x, gameItem.y, 'smallFont', wording);

    tintText(this, gameItem.roomName);
  }

  public setTintFill(color: integer): this {
    this.text.setTintFill(color);
    return this;
  }
}
