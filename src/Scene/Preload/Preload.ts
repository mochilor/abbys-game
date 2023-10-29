// audio
import coinSamplePath from 'url:../../../assets/audio/coin.ogg';
import coinSamplePathMp3 from 'url:../../../assets/audio/coin.mp3';
import springSamplePath from 'url:../../../assets/audio/spring.ogg';
import springSamplePathMp3 from 'url:../../../assets/audio/spring.mp3';
import portalSamplePath from 'url:../../../assets/audio/portal.ogg';
import portalSamplePathMp3 from 'url:../../../assets/audio/portal.mp3';
import spearSamplePath from 'url:../../../assets/audio/spear.ogg';
import spearSamplePathMp3 from 'url:../../../assets/audio/spear.mp3';
import saveSamplePath from 'url:../../../assets/audio/save.ogg';
import saveSamplePathMp3 from 'url:../../../assets/audio/save.mp3';
import buttonSamplePath from 'url:../../../assets/audio/button.ogg';
import buttonSamplePathMp3 from 'url:../../../assets/audio/button.mp3';
import doorSamplePath from 'url:../../../assets/audio/door.ogg';
import doorSamplePathMp3 from 'url:../../../assets/audio/door.mp3';
import titleMusic from 'url:../../../assets/audio/music/title.ogg';
import titleMusicMp3 from 'url:../../../assets/audio/music/title.mp3';
import endingMusic from 'url:../../../assets/audio/music/ending.ogg';
import endingMusicMp3 from 'url:../../../assets/audio/music/ending.mp3';

// tileset
import tilesetPath from '../../../assets/img/tileset.png';

// title
import title from '../../../assets/img/title/title.gif';

// bitmap fonts
import font from '../../../assets/font/font.png';
import smallFont from '../../../assets/font/small-font.png';

// sprites
import spritesAtlas from '../../../assets/sprites_atlas.json';
import sprites from '../../../assets/img/sprites.png';

// some functions
import { mapFiles, roomNames } from '../../Service/mapStore';
import progressBar from './ProgressBar';

export default class Preload extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  public preload(): void {
    // dist folder local path (workaround to load xml file path correctly here)
    // thanks to parcel-reporter-static-files-copy plugin
    this.load.bitmapFont('smallFont', smallFont, './xml/small-font.xml');
    this.load.bitmapFont('font', font, './xml/font.xml');

    this.load.image('tilesetImage', tilesetPath);
    this.load.image('titleImage', title);

    this.load.atlas('sprites', sprites, spritesAtlas);

    this.load.audio('coinSample', [coinSamplePath, coinSamplePathMp3]);
    this.load.audio('springSample', [springSamplePath, springSamplePathMp3]);
    this.load.audio('portalSample', [portalSamplePath, portalSamplePathMp3]);
    this.load.audio('spearSample', [spearSamplePath, spearSamplePathMp3]);
    this.load.audio('saveSample', [saveSamplePath, saveSamplePathMp3]);
    this.load.audio('buttonSample', [buttonSamplePath, buttonSamplePathMp3]);
    this.load.audio('doorSample', [doorSamplePath, doorSamplePathMp3]);
    this.load.audio('titleMusic', [titleMusic, titleMusicMp3]);
    this.load.audio('endingMusic', [endingMusic, endingMusicMp3]);

    // other textures
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xFF0000, 1.0);
    graphics.fillRect(0, 0, 2, 2);
    graphics.generateTexture('lightTexture', 2, 1);

    mapFiles().forEach((element: [string, object]) => {
      this.load.tilemapTiledJSON(element[0], element[1]);
    });

    progressBar(this);
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
