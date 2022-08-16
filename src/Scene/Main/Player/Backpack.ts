import Coin from '../Object/Coin';
import EventDispatcher from '../../../Service/EventDispatcher';
import Scuba from '../Object/Scuba';
import Fins from '../Object/Fins';

export default class Backpack {
  private content = {
    coins: 0,
    scuba: 0,
    fins: 0,
  };

  public addItem(item: Phaser.GameObjects.Sprite) {
    if (item instanceof Coin) {
      this.content.coins += 1;
      EventDispatcher.getInstance().emit('getCoin');
    }

    if (item instanceof Scuba) {
      this.content.scuba = 1;
      EventDispatcher.getInstance().emit('getScuba');
    }

    if (item instanceof Fins) {
      this.content.fins = 1;
      EventDispatcher.getInstance().emit('getFins');
    }
  }
}
