import playerSpritePath from '../../../assets/img/player.png';
import playerSpriteSheetPath from '../../../assets/img/player-spritesheet.png';
import tilesetPath from '../../../assets/img/tileset.png';
import objectsSpriteSheetsPath from '../../../assets/img/objects-spritesheets.png';
import blocksImagePath from '../../../assets/img/blocks.png';
import spearImagePath from '../../../assets/img/spear.png';
import ballImagePath from '../../../assets/img/ball.png';
import portalImagePath from '../../../assets/img/portal.png';
import platformImagePath from '../../../assets/img/platform.png';
import bgUnderwaterPath from '../../../assets/img/background/bg-underwater.png';
import waterDetailsSpriteSheetPath from '../../../assets/img/background/water-details.png';
import maplist from '../../../assets/maplist.json';

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
    this.load.image('bgUnderwater', bgUnderwaterPath);
    this.load.spritesheet('objects', objectsSpriteSheetsPath, { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('waterDetails', waterDetailsSpriteSheetPath, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('playerSpritesheet', playerSpriteSheetPath, { frameWidth: 14, frameHeight: 21 });

    Object.entries(maplist).forEach((element: string[]) => {
      // dist folder local path:
      const file = `./maps/${element[1]}`;
      this.load.tilemapTiledJSON(element[0], file);
    });

    // this.load.pack();
  }

  public create(): void {
    this.scene.start('Main');
  }
}
