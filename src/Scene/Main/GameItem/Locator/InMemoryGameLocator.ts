import RoomName from '../../Map/RoomName';
import GameItemCollection from '../GameItemCollection';
import GameItem from '../GameItemInterface';
import GameItemLocator from '../GameItemLocatorInterface';

export default class InMemoryGameLocator implements GameItemLocator {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public getGameItemCollection(room: RoomName): GameItemCollection {
    const storedData: GameItem[] = this.scene.registry.get(room.getName());

    if (storedData == null) {
      throw new Error('No data in memory');
    }

    for (let n = 0; n < storedData.length; n += 1) {
      // set a real RoomName, not an object that fulfills RoomName class attributes (to improve)
      storedData[n].roomName = room;
    }

    return new GameItemCollection(storedData);
  }

  public getPlayerGameItem(): GameItem {
    const storedData: any = this.scene.registry.get('player');

    if (storedData == null) {
      throw new Error('No data in memory');
    }

    const playerItem: GameItem = storedData;

    return playerItem;
  }
}
