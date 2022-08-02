import Phaser from 'phaser';

let instance = null;

export default class EventDispatcher extends Phaser.Events.EventEmitter {
  public static getInstance(): EventDispatcher {
    if (instance == null) {
      instance = new EventDispatcher();
    }

    return instance;
  }
}
