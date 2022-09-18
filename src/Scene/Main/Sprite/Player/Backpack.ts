import Coin from '../Dynamic/Coin';
import EventDispatcher from '../../../../Service/EventDispatcher';
import Scuba from '../Dynamic/Scuba';
import Hands from '../Dynamic/Hands';
import Save from '../Dynamic/Save';
import Feet from '../Dynamic/Feet';
import GameItem from '../../GameItem/GameItemInterface';

function gotCoin(): void {
  EventDispatcher.getInstance().emit('playerGotCoin');
}

function gotScuba(): void {
  EventDispatcher.getInstance().emit('playerGotScuba');
}

function gotHands(): void {
  EventDispatcher.getInstance().emit('playerGotHands');
}

function gotFeet(): void {
  EventDispatcher.getInstance().emit('playerGotFeet');
}

export default class Backpack {
  private content = {
    coins: 0,
    scuba: 0,
    hands: 0,
    feet: 0,
  };

  constructor(properties: GameItem['properties']) {
    this.setContentFromSaving(properties);
  }

  private setContentFromSaving(properties: GameItem['properties']): void {
    properties.forEach((property) => {
      this.content[property.name] = property.value;
    });
  }

  public init(): void {
    for (let n = 1; n <= this.content.coins; n += 1) {
      gotCoin();
    }

    if (this.content.scuba) {
      gotScuba();
    }

    if (this.content.hands) {
      gotHands();
    }

    if (this.content.feet) {
      gotFeet();
    }
  }

  public getContentForSaving(): GameItem['properties'] {
    const content = [];

    Object.entries(this.content).forEach(([key, value]) => {
      content.push({
        name: key,
        value,
      });
    });

    return content;
  }

  public addItem(item: Phaser.GameObjects.Sprite) {
    let destroy = true;
    if (item instanceof Coin) {
      this.content.coins += 1;
      gotCoin();
    }

    if (item instanceof Scuba) {
      this.content.scuba = 1;
      gotScuba();
    }

    if (item instanceof Hands) {
      this.content.hands = 1;
      gotHands();
    }

    if (item instanceof Feet) {
      this.content.feet = 1;
      gotFeet();
    }

    if (item instanceof Save) {
      EventDispatcher.getInstance().emit('gameSaved', item, this);
      destroy = false;
    }

    if (destroy) {
      item.destroy();
      EventDispatcher.getInstance().emit('itemDestroyed', item);
    }
  }
}
