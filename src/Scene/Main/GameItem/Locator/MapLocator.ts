import GameItemLocator from '../GameItemLocatorInterface';
import GameItemCollection from '../GameItemCollection';
import GameItem from '../GameItemInterface';
import StaticGameItemCollection from '../StaticGameItemCollection';
import MapEventsGameItemCollection from '../MapEventsGameItemCollection';
import {
  playerItemClass,
  dynamicItemClasses,
  staticItemClasses,
  mapEventItemClasses,
} from '../../Sprite/factory';
import RoomName from '../../Map/RoomName';

/**
 * Loads game items from map (new game)
 */
export default class MapLocator implements GameItemLocator {
  private map: Phaser.Tilemaps.Tilemap;

  private playerItemClass = playerItemClass;

  private dynamicItemClasses = dynamicItemClasses;

  private staticItemClasses = staticItemClasses;

  private mapEventItemClasses = mapEventItemClasses;

  constructor(map: Phaser.Tilemaps.Tilemap) {
    this.map = map;
  }

  public getGameItemCollection(room: RoomName): GameItemCollection {
    const items = this.getGameItems(this.dynamicItemClasses, room);
    return new GameItemCollection(items);
  }

  public getStaticGameItemCollection(room: RoomName): StaticGameItemCollection {
    const items = this.getGameItems(this.staticItemClasses, room);
    return new StaticGameItemCollection(items);
  }

  public getMapEventsGameItemCollection(room: RoomName): MapEventsGameItemCollection {
    const items = this.getGameItems(this.mapEventItemClasses, room);
    return new MapEventsGameItemCollection(items);
  }

  private getGameItems(itemClasses: object, roomName: RoomName): GameItem[] {
    let items = [];
    const keys = Object.keys(itemClasses);
    for (let n = 0; n < keys.length; n += 1) {
      const itemClass = itemClasses[keys[n]];
      items = items.concat(this.makeGameItems(itemClass.key, itemClasses, roomName));
    }

    return items;
  }

  private makeGameItems(className: string, itemClasses: object, roomName?: RoomName): GameItem[] {
    const itemId = this.getItemId(className, itemClasses);
    const data = this.map.getObjectLayer('objects').objects;
    const result = [];
    const { firstgid } = this.map.getTileset('objects');

    data.forEach((mapItem: Phaser.Types.Tilemaps.TiledObject) => {
      if (itemId === mapItem.gid - firstgid + 1) {
        const item = {
          uuid: Phaser.Utils.String.UUID(),
          id: itemId,
          x: mapItem.x,
          y: mapItem.y,
          key: className,
          rotation: mapItem.rotation,
          roomName,
          properties: mapItem.properties ?? [],
        };

        result.push(item);
      }
    });

    return result;
  }

  private getItemId(className: string, itemClasses: object): number {
    const keys = Object.keys(itemClasses);
    for (let n = 0; n < keys.length; n += 1) {
      const itemClass = itemClasses[keys[n]];
      if (itemClass.key === className) {
        return parseInt(keys[n], 10);
      }
    }

    return 0;
  }

  public getPlayerGameItem(): GameItem {
    const playerItemArray = this.makeGameItems('Player', this.playerItemClass, null);

    if (playerItemArray.length === 0) {
      throw new Error('No player in this map');
    }

    return playerItemArray[0];
  }
}
