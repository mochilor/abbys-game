import Coin from '../Dynamic/Coin';
import EventDispatcher from '../../../../Service/EventDispatcher';
import Save from '../Static/Save';
import GameItem from '../../GameItem/GameItemInterface';
import GameObject from '../GameObject';
import Button from '../Dynamic/Button';

function gotCoin(): void {
  EventDispatcher.getInstance().emit('playerGotCoin');
}

function activateButton(eventName: string): void {
  EventDispatcher.getInstance().emit(eventName);
}

export default class Backpack {
  private content = {
    coins: 0,
    gameEvents: [],
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

    if (this.content.gameEvents.length) {
      this.content.gameEvents.forEach((eventName: string) => {
        activateButton(eventName);
      });
    }
  }

  public getContentForSaving(): GameItem['properties'] {
    const content = [];

    Object.entries(this.content).forEach(([key, value]) => {
      // Exclude other properties intended for room change:
      if (key === 'otherProperties') {
        return;
      }

      content.push({
        name: key,
        value,
      });
    });

    return content;
  }

  public addItem(item: GameObject) {
    let destroy = true;
    if (item instanceof Coin) {
      this.content.coins += 1;
      gotCoin();
    }

    if (item instanceof Save) {
      EventDispatcher.getInstance().emit('gameSaved', item, this);
      destroy = false;
    }

    if (item instanceof Button) {
      const eventName = item.getEventName();
      this.content.gameEvents.push(eventName);
      activateButton(eventName);
    }

    if (destroy) {
      item.destroy();
      EventDispatcher.getInstance().emit('itemDestroyed', item);
    }
  }
}
