import Phaser from 'phaser';

let instance = null;

function getInstance(): Phaser.Events.EventEmitter {
  if (instance == null) {
    instance = new Phaser.Events.EventEmitter();
  }

  return instance;
}

export function emit(eventName: string, ...args: any[]): void {
  getInstance().emit(eventName, ...args);
}

export function on(eventName: string, fn: Function, context?: any): void {
  getInstance().on(eventName, fn, context);
}

export function removeAllListeners(): void {
  getInstance().removeAllListeners();
}
