import Coin from '../Dynamic/Coin';
import * as EventDispatcher from '../../../../Service/EventDispatcher';
import Save from '../Static/Save';
import GameItem from '../../GameItem/GameItemInterface';
import GameObject from '../GameObject';
import Button from '../Dynamic/Button';

function gotCoin(roomName: string): void {
  EventDispatcher.emit('playerGotCoin', roomName);
}

function activateButton(eventName: string): void {
  EventDispatcher.emit(eventName);
}

export default class Backpack {
  private content = {
    coins: [],
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
    for (let n = 0; n < this.content.coins.length; n += 1) {
      gotCoin(this.content.coins[n]);
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
      const roomName = item.getRoomName();
      this.content.coins.push(roomName);
      gotCoin(roomName);
    }

    if (item instanceof Save) {
      EventDispatcher.emit('gameSaved', item, this);
      destroy = false;
    }

    if (item instanceof Button) {
      const eventName = item.getEventName();
      this.content.gameEvents.push(eventName);
      activateButton(eventName);
    }

    if (destroy) {
      item.destroy();
      EventDispatcher.emit('itemDestroyed', item);
    }
  }
}
