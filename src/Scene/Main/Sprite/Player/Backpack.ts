import Coin from '../GameObject/Coin';
import EventDispatcher from '../../../../Service/EventDispatcher';
import Scuba from '../GameObject/Scuba';
import Fins from '../GameObject/Fins';
import Save from '../GameObject/Save';

export default class Backpack {
  private content = {
    coins: 0,
    scuba: 0,
    fins: 0,
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

    if (item instanceof Fins) {
      this.content.fins = 1;
      EventDispatcher.getInstance().emit('playerGotFins');
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
