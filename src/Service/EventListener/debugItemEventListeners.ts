import { debugIsEnabled, updateDebugContainer } from '../../Scene/Main/Debug/debug';
import { CoinZones } from '../../Scene/Main/GameItem/CoinCounter/types';
import * as EventDispatcher from '../EventDispatcher';

function coinCounterUpdated(currentCoins: CoinZones): void {
  updateDebugContainer(currentCoins);
}

export default function listenDebugEvents(): void {
  if (!debugIsEnabled()) {
    return;
  }

  EventDispatcher.on('coinCounterUpdated', coinCounterUpdated);
}
