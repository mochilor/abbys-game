import { GameItem, GameItemCollection, GameItemLocator } from '../../Interfaces';
import { itemClasses } from '../../Object/factory';
import Collection from '../Collection';

interface MapItem {
  gid: number,
  x: number,
  y: number,
  properties?: {
    name: string,
    value: number | string,
  }[],
}

interface Map {
  tileheight: number,
  tilewidth: number,
  width: number,
  layers: {
    name: string,
    objects?: MapItem[],
  }[],
  tilesets: {
    firstgid: number,
    name: string,
  }[],
}

/**
 * Loads game items from map (new game)
 */
export default class MapLocator implements GameItemLocator {
  private map: Map;

  private itemClasses = itemClasses;

  private firstGid: number;

  constructor(map: Map) {
    this.map = map;
    this.firstGid = this.getFirstgid();
  }

  private getFirstgid(): number {
    for (let n = 0; n < this.map.tilesets.length; n += 1) {
      if (this.map.tilesets[n].name === 'objects') {
        return this.map.tilesets[n].firstgid;
      }
    }

    return 1;
  }

  public getGameItemCollection(): GameItemCollection {
    let items = [];
    const keys = Object.keys(this.itemClasses);
    for (let n = 0; n < keys.length; n += 1) {
      const itemClass = itemClasses[keys[n]];
      items = items.concat(this.getObjectPositions(itemClass.key));
    }

    return new Collection(items);
  }

  private getObjectPositions(className: string): GameItem[] {
    const itemId = this.getItemId(className);
    const data = this.getLayerData();
    const result = [];

    data.forEach((mapItem: MapItem) => {
      if (itemId === mapItem.gid - this.firstGid + 1) {
        const item = {
          uuid: Phaser.Utils.String.UUID(),
          id: itemId,
          x: mapItem.x,
          y: mapItem.y,
          key: className,
          properties: mapItem.properties ?? [],
        };

        result.push(item);
      }
    });

    return result;
  }

  private getItemId(className: string): number {
    const keys = Object.keys(this.itemClasses);
    for (let n = 0; n < keys.length; n += 1) {
      const itemClass = itemClasses[keys[n]];
      if (itemClass.key === className) {
        return parseInt(keys[n], 10);
      }
    }

    return 0;
  }

  private getLayerData(): MapItem[] {
    for (let n = 0; n < this.map.layers.length; n += 1) {
      if (this.map.layers[n].name === 'objects') {
        return this.map.layers[n].objects;
      }
    }

    return [];
  }
}
