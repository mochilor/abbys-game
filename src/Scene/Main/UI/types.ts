import RoomName from '../Map/RoomName';
import Ruby from '../Sprite/Collidable/Static/Ruby';

export interface Title {
  quit: () => void,
  showAlertText: () => void,
  hideAlertText: () => void,
  init: () => void,
}

export interface PauseButton {
  pause: () => void,
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
  renderFinalText: (ruby: Ruby | null) => void,
}
