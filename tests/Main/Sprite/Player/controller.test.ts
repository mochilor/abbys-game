import Phaser from 'phaser';
import { createController } from '../../../../src/Scene/Main/Sprite/Player/controller';

// https://stackoverflow.com/questions/47606545/mock-a-dependencys-constructor-jest

// jest.mock('phaser', () => {
//     Phaser: {
//       Input: {
//         Keyboard: {
//           Key: jest.fn().mockImplementation(() => { return {} })
//         }
//       }
//     }
// });

describe('testing player Controller', () => {
  test('controller returns an object', () => {
    const leftKeyMock = new Phaser.Input.Keyboard.Key();
    const rightKeyMock = new Phaser.Input.Keyboard.Key();

    const controller = createController(leftKeyMock, rightKeyMock);
  });
});
