import Door from '../../Scene/Main/Sprite/Collidable/Dynamic/Door';
import * as EventDispatcher from '../EventDispatcher';

let doorsGroup: Door[];

function unlock(): void {
  doorsGroup.forEach((door: Door) => {
    door.unlock();
  });
}

export default function listenDoorEvents(doors: Door[]): void {
  doorsGroup = doors;
  EventDispatcher.on('playerGotCoin', unlock);
}
