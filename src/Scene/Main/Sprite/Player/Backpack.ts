import Coin from '../Collidable/Dynamic/Coin';
import * as EventDispatcher from '../../../../Service/EventDispatcher';
import Save from '../Collidable/Static/Save';
import { GameItem } from '../../GameItem/types';
import GameObject from '../GameObject';
import Button from '../Collidable/Dynamic/Button';
import Ruby from '../Collidable/Static/Ruby/Ruby';

function gotCoin(roomName: string, playSound: boolean): void {
  EventDispatcher.emit('playerGotCoin', roomName, playSound);
}

function activateButton(eventName: string): void {
  EventDispatcher.emit(eventName);
  EventDispatcher.emit('buttonActivated');
}

function gotRuby(ruby: Ruby): void {
  EventDispatcher.emit('playerGotRuby', ruby);
}

export default class Backpack {
  private content = {
    coins: [],
    gameEvents: [],
  };

  private gotRuby: boolean = false;

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
      gotCoin(this.content.coins[n], false);
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
      gotCoin(roomName, true);
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

    if (item instanceof Ruby) {
      destroy = false;
      if (this.gotRuby) {
        return;
      }

      gotRuby(item);
      this.gotRuby = true;
    }

    if (destroy) {
      item.destroy();
      EventDispatcher.emit('itemDestroyed', item);
    }
  }
}
