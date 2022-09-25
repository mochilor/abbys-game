import GameItemLocator from '../GameItemLocatorInterface';
import { dynamicItemClasses, staticItemClasses, mapEventItemClasses } from '../../Sprite/factory';
import GameItemCollection from '../GameItemCollection';
import GameItem from '../GameItemInterface';
import StaticGameItemCollection from '../StaticGameItemCollection';
import MapEventsGameItemCollection from '../MapEventsGameItemCollection';

interface MapItem {
  gid: number,
  x: number,
  y: number,
  rotation: number,
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

  private dynamicItemClasses = dynamicItemClasses;

  private staticItemClasses = staticItemClasses;

  private mapEventItemClasses = mapEventItemClasses;

  constructor(map: Map) {
    this.map = map;
  }

  public getGameItemCollection(): GameItemCollection {
    const items = this.getGameItems(this.dynamicItemClasses);
    return new GameItemCollection(items);
  }

  public getStaticGameItemCollection(): StaticGameItemCollection {
    const items = this.getGameItems(this.staticItemClasses);
    return new StaticGameItemCollection(items);
  }

  public getMapEventsGameItemCollection(): MapEventsGameItemCollection {
    const items = this.getGameItems(this.mapEventItemClasses);
    return new MapEventsGameItemCollection(items);
  }

  private getGameItems(itemClasses: object): GameItem[] {
    let items = [];
    const keys = Object.keys(itemClasses);
    for (let n = 0; n < keys.length; n += 1) {
      const itemClass = itemClasses[keys[n]];
      items = items.concat(this.makeGameItems(itemClass.key, itemClasses));
    }

    return items;
  }

  private makeGameItems(className: string, itemClasses: object): GameItem[] {
    const itemId = this.getItemId(className, itemClasses);
    const data = this.getLayerData('objects');
    const result = [];
    const firstGid = this.getFirstgid('objects');

    data.forEach((mapItem: MapItem) => {
      if (itemId === mapItem.gid - firstGid + 1) {
        const item = {
          uuid: Phaser.Utils.String.UUID(),
          id: itemId,
          x: mapItem.x,
          y: mapItem.y,
          key: className,
          rotation: mapItem.rotation,
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

  private getLayerData(layerName: string): MapItem[] {
    for (let n = 0; n < this.map.layers.length; n += 1) {
      if (this.map.layers[n].name === layerName) {
        return this.map.layers[n].objects;
      }
    }

    return [];
  }

  private getFirstgid(tilesetName: string): number {
    for (let n = 0; n < this.map.tilesets.length; n += 1) {
      if (this.map.tilesets[n].name === tilesetName) {
        return this.map.tilesets[n].firstgid;
      }
    }

    return 1;
  }
}
