import Door from '../../Scene/Main/Sprite/Dynamic/Door';
import EventDispatcher from '../EventDispatcher';

let doorsGroup: Door[];

function unlock(): void {
  doorsGroup.forEach((door: Door) => {
    door.unlock();
  });
}

export default function listenDoorEvents(doors: Door[]): void {
  doorsGroup = doors;
  EventDispatcher.getInstance().on('playerGotCoin', unlock);
}
