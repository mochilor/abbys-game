import { GameItem } from '../Scene/Main/GameItem/types';

export type Settings = {
  audio: boolean,
};

export type SoundPlayer = {
  playCoinSample: () => void,
  playSpringSample: () => void,
  playPortalSample: () => void,
  playSpearSample: () => void,
  playSaveSample: () => void,
  playButtonSample: () => void,
  playDoorSample: () => void,
  playTitleMusic: () => void,
  fadeTitleMusic: () => void,
  stopTitleMusic: () => void,
  setMuteStatus: (status: boolean) => void,
  playEndingMusic: () => void,
  prepareEndingMusic: () => void,
};

export interface SavedGame {
  gameItems: {
    room: {
      x: number,
      y: number,
    },
    items: GameItem[],
  }[],
  playerItem: GameItem,
  room: {
    x: number,
    y: number,
  },
}
