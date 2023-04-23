export interface Title {
  quit: () => void,
  showAlertText: () => void,
  hideAlertText: () => void,
}

export interface PauseButton {
  pause: () => void,
}

export interface Ending {
  start: () => void,
}
