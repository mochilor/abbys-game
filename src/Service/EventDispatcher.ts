import Phaser from 'phaser';

let instance = null;

class EventDispatcher extends Phaser.Events.EventEmitter {
  public static getInstance(): EventDispatcher {
    if (instance == null) {
      instance = new EventDispatcher();
    }

    return instance;
  }
}

export function emit(eventName: string, ...args: any[]): void {
  EventDispatcher.getInstance().emit(eventName, ...args);
}

export function on(eventName: string, fn: Function, context?: any): void {
  EventDispatcher.getInstance().on(eventName, fn, context);
}

export function removeAllListeners(): void {
  EventDispatcher.getInstance().removeAllListeners();
}
