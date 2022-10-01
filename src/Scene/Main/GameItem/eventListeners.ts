import EventDispatcher from '../../../Service/EventDispatcher';
import { saveGame } from '../../../Service/gameStore';
import GameObject from '../Sprite/GameObject';
import Backpack from '../Sprite/Player/Backpack';
import Player from '../Sprite/Player/Player';
import Save from '../Sprite/Static/Save';
import GameItemCollection from './GameItemCollection';
import GameItem from './GameItemInterface';

let gameItems: GameItemCollection;

let playerItem: GameItem;

let registry: Phaser.Data.DataManager;

function itemDestroyed(item: GameObject) {
  const uuid = item.getUuid();
  gameItems.deleteItem(uuid);
}

function gameSaved(item: Save, backpack: Backpack) {
  const saveItem = item;
  saveItem.body.enable = false;
  saveItem.visible = false;

  playerItem.x = saveItem.x;
  playerItem.y = saveItem.y;

  const backpackContent = backpack.getContentForSaving();
  playerItem.properties = backpackContent;

  saveGame(gameItems, playerItem, item.getRoomName());
}

function newRoomReached(
  newRoomData: { x: number, y: number },
  oldRoomData: { x: number, y: number },
  player: Player,
): void {
  const backpack = player.getBackpack();
  const backpackContent = backpack.getContentForSaving();
  playerItem.properties = backpackContent;
  playerItem.x = player.getPositionInNewRoom().x;
  playerItem.y = player.getPositionInNewRoom().y;

  registry.set(`${oldRoomData.x}_${oldRoomData.y}`, gameItems.getItems());
  registry.set('player', playerItem);
}

export default function listenGameItemEvents(
  gameItemCollection: GameItemCollection,
  player: GameItem,
  sceneRegistry: Phaser.Data.DataManager,
) {
  gameItems = gameItemCollection;
  playerItem = player;
  registry = sceneRegistry;

  EventDispatcher.getInstance().on('itemDestroyed', itemDestroyed);
  EventDispatcher.getInstance().on('gameSaved', gameSaved);
  EventDispatcher.getInstance().on('newRoomReached', newRoomReached);
}
