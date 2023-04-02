import playerSpriteSheetPath from '../../../assets/img/player-spritesheet.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import blocksImagePath from '../../../assets/img/blocks.png';
import spearImagePath from '../../../assets/img/spear.png';
import ballImagePath from '../../../assets/img/ball.png';
import portalImagePath from '../../../assets/img/portal.png';
import platformImagePath from '../../../assets/img/platform.png';
import spikePlatformImagePath from '../../../assets/img/spike-platform.png';
import conveyorSpriteSheetPath from '../../../assets/img/conveyor.png';
import bgUnderwaterPath from '../../../assets/img/background/bg-underwater.png';
import smallFishSpritesheet from '../../../assets/img/background/fish.png';
import bigFishSpriteSheetPath from '../../../assets/img/background/fish-2.png';
import waterDetailsSpriteSheetPath from '../../../assets/img/background/water-details.png';
import crabSpriteSheetPath from '../../../assets/img/crab-spritesheet.png';
import mummySpriteSheetPath from '../../../assets/img/mummy-spritesheet.png';
import robotSpriteSheetPath from '../../../assets/img/robot-spritesheet.png';
import countersSpriteSheetPath from '../../../assets/img/counters-spritesheet.png';
import title from '../../../assets/img/title/title.png';
import { mapFiles, roomNames } from '../../Service/mapStore';
import font from '../../../assets/font/font.png';

export default class Preload extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  public preload(): void {
    this.load.image('tilesetImage', tilesetPath);
    this.load.image('blocksImage', blocksImagePath);
    this.load.image('spearImage', spearImagePath);
    this.load.image('ballImage', ballImagePath);
    this.load.image('portalImage', portalImagePath);
    this.load.image('platformImage', platformImagePath);
    this.load.image('spikePlatformImage', spikePlatformImagePath);
    this.load.image('bgUnderwater', bgUnderwaterPath);
    this.load.image('titleImage', title);
    this.load.spritesheet('smallFishSpritesheet', smallFishSpritesheet, { frameWidth: 8, frameHeight: 7 });
    this.load.spritesheet('bigFishSpritesheet', bigFishSpriteSheetPath, { frameWidth: 12, frameHeight: 10 });
    this.load.spritesheet('objects', objectsSpriteSheetsPath, { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('waterDetails', waterDetailsSpriteSheetPath, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('playerSpritesheet', playerSpriteSheetPath, { frameWidth: 14, frameHeight: 21 });
    this.load.spritesheet('conveyorSpriteSheet', conveyorSpriteSheetPath, { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('crabSpriteSheet', crabSpriteSheetPath, { frameWidth: 18, frameHeight: 16 });
    this.load.spritesheet('mummySpriteSheet', mummySpriteSheetPath, { frameWidth: 14, frameHeight: 20 });
    this.load.spritesheet('robotSpriteSheet', robotSpriteSheetPath, { frameWidth: 21, frameHeight: 17 });
    this.load.spritesheet('countersSpriteSheet', countersSpriteSheetPath, { frameWidth: 16, frameHeight: 16 });

    // dist folder local path (workaround to load xml file path correctly here)
    // thanks to parcel-reporter-static-files-copy plugin
    this.load.bitmapFont('font', font, './xml/font.xml');

    mapFiles().forEach((element: string[]) => {
      // dist folder local path
      const file = `./maps/${element[1]}`;
      this.load.tilemapTiledJSON(element[0], file);
    });

    // this.load.pack();
  }

  public create(): void {
    const coinsTotal = [];

    roomNames().forEach((element: string) => {
      const currentTotal = {
        room: element,
        coins: 0,
      };
      const map = this.add.tilemap(element);
      const { firstgid } = map.getTileset('objects');
      const data = map.getObjectLayer('objects').objects;
      data.forEach((mapItem: Phaser.Types.Tilemaps.TiledObject) => {
        if (mapItem.gid === firstgid) {
          currentTotal.coins += 1;
        }
      });
      coinsTotal.push(currentTotal);
    });

    this.registry.set('coinsTotal', coinsTotal);
    this.registry.set('start', true);

    this.scene.start('Main');
  }
}
