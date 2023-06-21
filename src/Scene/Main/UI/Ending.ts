import config from '../../../../config/config.json';
import { Ending } from './types';
import createMenu from '../../../UI/Menu';
import * as EventDispatcher from '../../../Service/EventDispatcher';
import closeUIElement from '../../../UI/ClosingAnimation';
import RoomName from '../Map/RoomName';

let currentRoom = 0;

export default function createEnding(scene: Phaser.Scene): Ending {
  const roomTexts = [
    'Add some text here',
    'Programming, Graphics and Sound\n\nDiego Altamirano (mochilo)',
    'Additional testing and ideas\n\nIvan and Alvaro',
    'Thanks for playing!',
  ];

  const finalText = 'Now try again and find the real treasure!';

  const textObjects = [];

  const background = (() => {
    const rectangle = scene.add.rectangle(
      0,
      0,
      config.gameWidth,
      config.gameHeight + 10,
      0x000000,
      1,
    );
    rectangle.setOrigin(0, 0);
    rectangle.setDepth(1);
    rectangle.setScrollFactor(0);
    rectangle.setVisible(false);
    rectangle.setAlpha(0);

    return rectangle;
  })();

  const { x } = background.getCenter();
  const y = background.getCenter().y - 64;

  const congratulations = createMenu(
    x,
    y,
    scene,
    'Congratulations!\nYou found the legendary treasure',
  );

  const secondaryText = createMenu(
    x,
    y + 32,
    scene,
    'Now is time to go home',
  );

  textObjects.push(congratulations.getText(), secondaryText.getText());

  const tween = scene.tweens.add({
    props: {
      alpha: 1,
    },
    targets: background,
    duration: 2000,
    loop: 0,
    ease: 'linear',
    paused: true,
    delay: 1000,
    onComplete: () => EventDispatcher.emit('endingBackgroundComplete'),
  });

  function init(): void {
    this.start();
    currentRoom = 0; // Just in case the end has to run again on the same game
  }

  function start(): void {
    background.setVisible(true);
    tween.play();
  }

  function startWithoutAnimation(): void {
    background.setVisible(true);
    background.setAlpha(1);
  }

  function renderSecondaryText(): void {
    secondaryText.show();
  }

  function textIsComplete(): void {
    EventDispatcher.emit('endingText1Complete');
  }

  function renderText(): void {
    congratulations.show();

    scene.time.delayedCall(3000, renderSecondaryText);
    scene.time.delayedCall(5000, textIsComplete);
  }

  function hide(): void {
    closeUIElement(
      scene,
      [
        background,
        ...textObjects,
      ],
    );

    textObjects.length = 0;
  }

  function renderRoomText(): void {
    const text = createMenu(
      x,
      y,
      scene,
      roomTexts[currentRoom],
    );
    text.show();

    textObjects.push(text.getText());

    scene.time.delayedCall(3000, hide);
  }

  function rooms(isRealEnding: boolean): string[] {
    if (isRealEnding) {
      return [
        '2_9',
        '5_5',
        '5_2',
        '5_0',
      ];
    }

    return [
      '5_7',
      '3_6',
      '3_3',
      '5_0',
    ];
  }

  function getEndingRoom(isRealEnding: boolean): RoomName | null {
    const allRooms = rooms(isRealEnding);

    if (allRooms[currentRoom]) {
      return RoomName.fromName(allRooms[currentRoom]);
    }

    return null;
  }

  function increaseEndingRoom(): void {
    currentRoom += 1;
  }

  function renderFinalText(): void {
    const text = createMenu(
      x,
      y,
      scene,
      finalText,
    );
    text.show();
  }

  return {
    init,
    start,
    startWithoutAnimation,
    renderText,
    renderRoomText,
    hide,
    getEndingRoom,
    increaseEndingRoom,
    renderFinalText,
  };
}
