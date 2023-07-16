import RoomName from '../Map/RoomName';
import Coin from '../Sprite/Collidable/Dynamic/Coin';
import Ruby from '../Sprite/Collidable/Static/Ruby';

export interface Title {
  quit: () => void,
  showAlertText: () => void,
  hideAlertText: () => void,
  init: () => void,
}

export interface PauseButton {
  pause: () => void,
  hide: () => void,
  show: () => void,
}

export interface Ending {
  init: () => void,
  start: () => void,
  startWithoutAnimation: () => void,
  renderText: () => void,
  renderRoomText: () => void,
  hide: () => void,
  increaseEndingRoom: () => void,
  getEndingRoom: () => RoomName | null,
  renderFinalText: (ruby: Ruby | null, coinCounter: Coin | null) => void,
}
