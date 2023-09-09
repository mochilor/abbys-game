import playerSpriteSheetPath from '../../../assets/img/player-spritesheet.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import blocksSpriteSheetPath from '../../../assets/img/blocks.png';
import spearImagePath from '../../../assets/img/spear.png';
import ballImagePath from '../../../assets/img/ball.png';
import portalSpriteSheetPath from '../../../assets/img/portal.png';
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
import rubySpriteSheetPath from '../../../assets/img/ruby-spritesheet.png';
import title from '../../../assets/img/title/title.gif';
import emptyImage from '../../../assets/img/empty.gif';
import anchorSpriteSheetPath from '../../../assets/img/anchor-spritesheet.png';
import anchorRope from '../../../assets/img/anchor-rope.png';
import { mapFiles, roomNames } from '../../Service/mapStore';
import font from '../../../assets/font/font.png';
import smallFont from '../../../assets/font/small-font.png';

// audio
import coinSamplePath from 'url:../../../assets/audio/coin.ogg';
import springSamplePath from 'url:../../../assets/audio/spring.ogg';
import portalSamplePath from 'url:../../../assets/audio/portal.ogg';
import spearSamplePath from 'url:../../../assets/audio/spear.ogg';
import saveSamplePath from 'url:../../../assets/audio/save.ogg';
import buttonSamplePath from 'url:../../../assets/audio/button.ogg';
import doorSamplePath from 'url:../../../assets/audio/door.ogg';
import titleMusic from 'url:../../../assets/audio/music/title.ogg';
import endingMusic from 'url:../../../assets/audio/music/ending.ogg';

// preload functions
import progressBar from './ProgressBar';

export default class Preload extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  public preload(): void {
    // dist folder local path (workaround to load xml file path correctly here)
    // thanks to parcel-reporter-static-files-copy plugin
    this.load.bitmapFont('font', font, './xml/font.xml');
    this.load.bitmapFont('smallFont', smallFont, './xml/small-font.xml');

    this.load.image('tilesetImage', tilesetPath);
    this.load.image('spearImage', spearImagePath);
    this.load.image('ballImage', ballImagePath);
    this.load.image('platformImage', platformImagePath);
    this.load.image('spikePlatformImage', spikePlatformImagePath);
    this.load.image('bgUnderwater', bgUnderwaterPath);
    this.load.image('titleImage', title);
    this.load.image('anchorRopeImage', anchorRope);
    this.load.image('emptyImage', emptyImage);
    this.load.spritesheet('anchorSpriteSheet', anchorSpriteSheetPath, { frameWidth: 33, frameHeight: 37 });
    this.load.spritesheet('blocksSpriteSheet', blocksSpriteSheetPath, { frameWidth: 24, frameHeight: 24 });
    this.load.spritesheet('portalSpriteSheet', portalSpriteSheetPath, { frameWidth: 16, frameHeight: 16 });
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
    this.load.spritesheet('rubySpriteSheet', rubySpriteSheetPath, { frameWidth: 10, frameHeight: 17 });

    this.load.audio('coinSample', coinSamplePath);
    this.load.audio('springSample', springSamplePath);
    this.load.audio('portalSample', portalSamplePath);
    this.load.audio('spearSample', spearSamplePath);
    this.load.audio('saveSample', saveSamplePath);
    this.load.audio('buttonSample', buttonSamplePath);
    this.load.audio('doorSample', doorSamplePath);
    this.load.audio('titleMusic', titleMusic);
    this.load.audio('endingMusic', endingMusic);

    // other textures
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xFF0000, 1.0);
    graphics.fillRect(0, 0, 2, 2);
    graphics.generateTexture('lightTexture', 2, 1);

    mapFiles().forEach((element: string[]) => {
      // dist folder local path
      const file = `./maps/${element[1]}`;
      this.load.tilemapTiledJSON(element[0], file);
    });

    progressBar(this);

    // this.load.pack();
  }

  public create(): void {
    const coinsTotal = [];
    const portalDestinations = [];

    roomNames().forEach((element: string) => {
      const currentTotal = {
        room: element,
        coins: 0,
      };

      const map = this.add.tilemap(element);
      const { firstgid } = map.getTileset('objects');
      const data = map.getObjectLayer('objects').objects;

      const coinId = firstgid;
      const portalId = firstgid + 14;

      function getPropertyValue(
        mapItem: Phaser.Types.Tilemaps.TiledObject,
        property: string,
      ): integer | string | null {
        for (let n = 0; n < mapItem.properties.length; n += 1) {
          if (mapItem.properties[n].name === property) {
            return mapItem.properties[n].value;
          }
        }

        return null;
      }

      data.forEach((mapItem: Phaser.Types.Tilemaps.TiledObject) => {
        if (mapItem.gid === coinId) {
          currentTotal.coins += 1;
        }

        if (mapItem.gid === portalId) {
          portalDestinations.push({
            room: getPropertyValue(mapItem, 'destinationRoom'),
            x: parseInt(getPropertyValue(mapItem, 'destinationX') as string, 10),
            y: parseInt(getPropertyValue(mapItem, 'destinationY') as string, 10),
            key: 'PortalDestination',
          });
        }
      });
      coinsTotal.push(currentTotal);
    });

    this.registry.set('coinsTotal', coinsTotal);
    this.registry.set('portalDestinations', portalDestinations);
    this.registry.set('start', true);

    this.scene.start('Main');
  }
}
