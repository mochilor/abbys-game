import Coin from '../Items/Coin';

export default class Backpack {
  private content = {
    coins: 0,
  };

  public addItem(item: Phaser.GameObjects.Sprite) {
    if (item instanceof Coin) {
      this.content.coins += 1;
    }
  }
}
