import config from '../../../../config/config.json';
import { Ending } from './types';
import createMenu from '../../../UI/Menu';
import * as EventDispatcher from '../../../Service/EventDispatcher';
import closeUIElement from '../../../UI/ClosingAnimation';
import RoomName from '../Map/RoomName';
import Ruby from '../Sprite/Collidable/Static/Ruby';
import Coin from '../Sprite/Collidable/Dynamic/Coin';
import * as CoinCounter from '../GameItem/CoinCounter/CoinCounter';
import makeCoinCounterDisplay from '../../../UI/CoinCounterDisplay';

let currentRoom = 0;

export default function createEnding(scene: Phaser.Scene, isRealEnding: boolean): Ending {
  const roomTexts = [
    '',
    'Programming, Graphics and Sound\n\nDiego Altamirano',
    'Additional testing and ideas\n\nIvan Altamirano\n\nAlvaro Altamirano',
    'Thanks for playing!',
  ];

  const finalText = isRealEnding ? 'CONGRATULATIONS!' : 'Now try again and find the real treasure!';

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
    rectangle.setDepth(2);
    rectangle.setScrollFactor(0);
    rectangle.setVisible(false);
    rectangle.setAlpha(0);

    return rectangle;
  })();

  const { x } = background.getCenter();
  const y = background.getCenter().y - 32;

  const congratulations = createMenu(
    x,
    y,
    scene,
    `Congratulations!\nYou found the ${isRealEnding ? 'REAL' : 'legendary'} treasure`,
  );

  const secondaryText = createMenu(
    x,
    y + 24,
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

  function rooms(): string[] {
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

  function getEndingRoom(): RoomName | null {
    const allRooms = rooms();

    if (allRooms[currentRoom]) {
      return RoomName.fromName(allRooms[currentRoom]);
    }

    return null;
  }

  function increaseEndingRoom(): void {
    currentRoom += 1;
  }

  function renderFinalText(ruby: Ruby | null, coin: Coin | null): void {
    const text = createMenu(
      x,
      y,
      scene,
      finalText,
    );
    text.show();

    if (ruby) {
      ruby.stopBounce();
      ruby.setDepth(10);
      ruby.setX(x);
      ruby.setY(y + 32);
    }

    if (coin) {
      makeCoinCounterDisplay(scene, coin);
    }
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
