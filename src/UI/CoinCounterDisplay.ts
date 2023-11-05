import Coin from '../Scene/Main/Sprite/Collidable/Dynamic/Coin';
import * as CoinCounter from '../Scene/Main/GameItem/CoinCounter/CoinCounter';
import createMenu from './Menu';

export default function makeCoinCounterDisplay(scene: Phaser.Scene, coin: Coin) {
  coin.setDepth(10);

  const coinCounter = CoinCounter.getInstance();
  const total = coinCounter.getTotal();
  const current = coinCounter.getCurrent();

  const coinText = createMenu(
    coin.x,
    coin.y + 16,
    scene,
    `${current} / ${total}`,
  );
  coinText.show();
}
