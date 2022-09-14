import EventDispatcher from '../../../Service/EventDispatcher';
import { saveGame } from '../../../Service/gameStore';
import GameObject from '../Object/GameObject';
import GameItemCollection from './GameItemCollection';

let gameItems: GameItemCollection;

function itemDestroyed(item: GameObject) {
  const uuid = item.getUuid();
  gameItems.deleteItem(uuid);
}

function gameSaved(item: GameObject) {
  item.body.enable = false;
  item.visible = false;

  const playerItem = gameItems.getPlayerItem();
  playerItem.x = item.x;
  playerItem.y = item.y;

  saveGame(gameItems);
}

export default function listenGameItemEvents(gameItemCollection: GameItemCollection) {
  gameItems = gameItemCollection;
  EventDispatcher.getInstance().on('itemDestroyed', itemDestroyed);
  EventDispatcher.getInstance().on('gameSaved', gameSaved);
  console.log(gameItemCollection);
}
