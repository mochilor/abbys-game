import { GameItem } from './Interfaces';
import { itemClasses } from './Object/factory';
import Coin from './Object/Coin';
import Door from './Object/Door';
import Fins from './Object/Fins';
import Scuba from './Object/Scuba';

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

export default class LayerIterator {
  private map: Map;

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

  public getPlayerPosition(): GameItem {
    return this.getObjectPositions(2)[0];
  }

  public getCoinPositions(): GameItem[] {
    const itemId = this.getObjectKey(Coin);
    return this.getObjectPositions(itemId);
  }

  public getScubaPosition(): GameItem {
    const itemId = this.getObjectKey(Scuba);
    return this.getObjectPositions(itemId)[0];
  }

  public getFinsPosition(): GameItem {
    const itemId = this.getObjectKey(Fins);
    return this.getObjectPositions(itemId)[0];
  }

  public getDoorsPositions(): GameItem[] {
    const itemId = this.getObjectKey(Door);
    return this.getObjectPositions(itemId);
  }

  private getObjectKey(object: any): number {
    const keys = Object.keys(itemClasses);
    for (let n = 0; n < keys.length; n += 1) {
      if (itemClasses[keys[n]] === object) {
        return parseInt(keys[n], 10);
      }
    }

    return 0;
  }

  private getObjectPositions(itemId: number): GameItem[] {
    const data = this.getLayerData();
    const result = [];

    data.forEach((mapItem: MapItem) => {
      if (itemId === mapItem.gid - this.firstGid + 1) {
        const item = {
          id: itemId,
          x: mapItem.x,
          y: mapItem.y,
          properties: mapItem.properties ?? [],
        };

        result.push(item);
      }
    });

    return result;
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
