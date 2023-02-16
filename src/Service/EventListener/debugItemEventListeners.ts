import { debugIsEnabled, updateDebugContainer } from '../../Scene/Main/Debug/debug';
import CoinZonesInterface from '../../Scene/Main/GameItem/CoinCounter/CoinZonesInterface';
import * as EventDispatcher from '../EventDispatcher';

function coinCounterUpdated(currentCoins: CoinZonesInterface): void {
  updateDebugContainer(currentCoins);
}

export default function listenDebugEvents(): void {
  if (!debugIsEnabled()) {
    return;
  }

  EventDispatcher.on('coinCounterUpdated', coinCounterUpdated);
}
