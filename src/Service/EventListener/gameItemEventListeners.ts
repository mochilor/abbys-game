import * as EventDispatcher from '../EventDispatcher';
import { saveGame } from '../gameStore';
import RoomName from '../../Scene/Main/Map/RoomName';
import GameObject from '../../Scene/Main/Sprite/GameObject';
import Backpack from '../../Scene/Main/Sprite/Player/Backpack';
import Player from '../../Scene/Main/Sprite/Player/Player';
import Save from '../../Scene/Main/Sprite/Collidable/Static/Save';
import GameItemCollection from '../../Scene/Main/GameItem/GameItemCollection';
import GameItem from '../../Scene/Main/GameItem/GameItemInterface';
import * as CoinCounter from '../../Scene/Main/GameItem/CoinCounter/CoinCounter';

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

  saveGame(gameItems, playerItem, item.getRoomName(), registry);
}

function newRoomReached(
  newRoomData: RoomName,
  oldRoomData: RoomName,
  player: Player,
): void {
  const backpack = player.getBackpack();
  const backpackContent = backpack.getContentForSaving();
  playerItem.properties = backpackContent;
  playerItem.x = player.getPositionInNewRoom().x;
  playerItem.y = player.getPositionInNewRoom().y;

  playerItem.otherProperties = {
    velocityY: player.body.velocity.y,
    leftKeyIsDown: player.getController().leftKeyIsDown(),
    rightKeyIsDown: player.getController().rightKeyIsDown(),
  };

  registry.set(oldRoomData.getName(), gameItems.getItems());
  registry.set('player', playerItem);
}

function playerGotCoin(room: string): void {
  const roomName = RoomName.fromName(room);
  CoinCounter.getInstance().add(roomName);
}

export default function listenGameItemEvents(
  gameItemCollection: GameItemCollection,
  player: GameItem,
  sceneRegistry: Phaser.Data.DataManager,
) {
  gameItems = gameItemCollection;
  playerItem = player;
  registry = sceneRegistry;

  EventDispatcher.on('itemDestroyed', itemDestroyed);
  EventDispatcher.on('gameSaved', gameSaved);
  EventDispatcher.on('newRoomReached', newRoomReached);
  EventDispatcher.on('playerGotCoin', playerGotCoin);
}
