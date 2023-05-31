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
};
