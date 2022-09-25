import EventDispatcher from '../../../../Service/EventDispatcher';
import Player from './Player';

let player: Player;

function playerGotFeet(): void {
  player.gotFeet();
}

export default function listenPlayerEvents(playerObject: Player): void {
  player = playerObject;
  EventDispatcher.getInstance().on('playerGotFeet', playerGotFeet);
}
