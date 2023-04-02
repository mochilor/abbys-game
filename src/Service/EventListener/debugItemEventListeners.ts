import { debugIsEnabled, updateDebugContainer } from '../../Scene/Main/Debug/debug';
import { CoinZones } from '../../Scene/Main/GameItem/CoinCounter/types';
import * as EventDispatcher from '../EventDispatcher';

export default function listenDebugEvents(): void {
  if (!debugIsEnabled()) {
    return;
  }

  function coinCounterUpdated(currentCoins: CoinZones): void {
    updateDebugContainer(currentCoins);
  }

  EventDispatcher.on('coinCounterUpdated', coinCounterUpdated);
}
