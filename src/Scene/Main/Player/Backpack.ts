import Coin from '../Object/Coin';
import EventDispatcher from '../../../Service/EventDispatcher';

export default class Backpack {
  private content = {
    coins: 0,
  };

  public addItem(item: Phaser.GameObjects.Sprite) {
    if (item instanceof Coin) {
      this.content.coins += 1;
      EventDispatcher.getInstance().emit('getCoin');
    }
  }
}
