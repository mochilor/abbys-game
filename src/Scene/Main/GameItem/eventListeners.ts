import EventDispatcher from '../../../Service/EventDispatcher';
import { saveGame } from '../../../Service/gameStore';
import GameObject from '../Sprite/GameObject';
import { Backpack } from '../Sprite/Player/Backpack';
import GameItemCollection from './GameItemCollection';

let gameItems: GameItemCollection;

function itemDestroyed(item: GameObject) {
  const uuid = item.getUuid();
  gameItems.deleteItem(uuid);
}

function gameSaved(saveItem: GameObject, backpack: Backpack) {
  saveItem.body.enable = false;
  saveItem.visible = false;

  const playerItem = gameItems.getPlayerItem();
  playerItem.x = saveItem.x;
  playerItem.y = saveItem.y;

  const backpackContent = backpack.getContentForSaving();
  playerItem.properties = backpackContent;

  saveGame(gameItems);
}

export default function listenGameItemEvents(gameItemCollection: GameItemCollection) {
  gameItems = gameItemCollection;
  EventDispatcher.getInstance().on('itemDestroyed', itemDestroyed);
  EventDispatcher.getInstance().on('gameSaved', gameSaved);
}
