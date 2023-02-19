import config from '../../../../config/config.json';
import * as CoinCounter from '../GameItem/CoinCounter/CoinCounter';
import CoinZonesInterface from '../GameItem/CoinCounter/CoinZonesInterface';

let debugContainer = null;

const counters = {
  cave: null,
  pyramid: null,
  base: null,
};

function debugIsEnabled(): boolean {
  return config.debug.enable && process.env.NODE_ENV === 'development';
}

function getDebugRoomName(): string | null {
  if (debugIsEnabled()) {
    return config.debug.level;
  }

  return null;
}

function addDebugContainer(): void {
  if (debugContainer || !debugIsEnabled()) {
    return;
  }

  const coinCounter = CoinCounter.getInstance();

  const levels = [
    {
      name: 'cave',
      total: coinCounter.caveTotalCoins(),
      current: coinCounter.caveCurrentCoins(),
    },
    {
      name: 'pyramid',
      total: coinCounter.pyramidTotalCoins(),
      current: coinCounter.pyramidCurrentCoins(),
    },
    {
      name: 'base',
      total: coinCounter.baseTotalCoins(),
      current: coinCounter.baseCurrentCoins(),
    },
  ];

  const container = document.createElement('div');
  container.id = 'debug-container';
  container.style.padding = '10px';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.right = '0';
  container.style.background = '#fff';
  container.style.zIndex = '99999';
  container.style.fontFamily = 'monospace';
  container.style.color = '#666';

  const coinCounterElement = document.createElement('div');
  coinCounterElement.id = 'debug-coincounter';

  const coinCounterTitle = document.createElement('b');
  coinCounterTitle.innerHTML = 'Coins';
  coinCounterElement.appendChild(coinCounterTitle);

  const coinList = document.createElement('table');
  coinList.style.listStyleType = 'none';
  coinList.style.padding = '5px';
  coinList.style.margin = '0';

  for (let n = 0; n < levels.length; n += 1) {
    const counter = document.createElement('tr');

    const label = document.createElement('td');
    label.innerHTML = levels[n].name;
    counter.appendChild(label);

    const counterBox = document.createElement('td');
    counterBox.innerHTML = levels[n].current.toString();
    counters[levels[n].name] = counterBox;
    counter.appendChild(counterBox);

    const counterBoxTotal = document.createElement('td');
    counterBoxTotal.innerHTML = levels[n].total.toString();
    counterBoxTotal.style.textAlign = 'right';
    counter.appendChild(counterBoxTotal);

    coinList.appendChild(counter);
  }

  coinCounterElement.appendChild(coinList);
  container.appendChild(coinCounterElement);
  debugContainer = document.body.appendChild(container);
}

function updateDebugContainer(coinZones: CoinZonesInterface): void {
  const caveCounter = counters.cave as HTMLTableCellElement;
  caveCounter.innerHTML = coinZones.cave.toString();

  const pyramidCounter = counters.pyramid as HTMLTableCellElement;
  pyramidCounter.innerHTML = coinZones.pyramid.toString();

  const baseCounter = counters.base as HTMLTableCellElement;
  baseCounter.innerHTML = coinZones.base.toString();
}

export {
  getDebugRoomName,
  addDebugContainer,
  debugIsEnabled,
  updateDebugContainer,
};
