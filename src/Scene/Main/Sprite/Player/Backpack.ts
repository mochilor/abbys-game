import Coin from '../Dynamic/Coin';
import EventDispatcher from '../../../../Service/EventDispatcher';
import Scuba from '../Dynamic/Scuba';
import Hands from '../Dynamic/Hands';
import Save from '../Dynamic/Save';
import Feet from '../Dynamic/Feet';

export default class Backpack {
  private content = {
    coins: 0,
    scuba: 0,
    hands: 0,
    feet: 0,
  };

  public addItem(item: Phaser.GameObjects.Sprite) {
    let destroy = true;
    if (item instanceof Coin) {
      this.content.coins += 1;
      EventDispatcher.getInstance().emit('playerGotCoin');
    }

    if (item instanceof Scuba) {
      this.content.scuba = 1;
      EventDispatcher.getInstance().emit('playerGotScuba');
    }

    if (item instanceof Hands) {
      this.content.hands = 1;
      EventDispatcher.getInstance().emit('playerGotHands');
    }

    if (item instanceof Feet) {
      this.content.feet = 1;
      EventDispatcher.getInstance().emit('playerGotFeet');
    }

    if (item instanceof Save) {
      EventDispatcher.getInstance().emit('gameSaved', item);
      destroy = false;
    }

    if (destroy) {
      item.destroy();
      EventDispatcher.getInstance().emit('itemDestroyed', item);
    }
  }
}
