import RoomName from '../../../Map/RoomName';
import config from '../../../../../../config/config.json';
import GameObject from '../../GameObject';

function tint(sprite: GameObject, roomName: RoomName, layer: string): void {
  let levelColor = null;
  if (roomName.getY() >= 5) {
    levelColor = 5;
  }

  if (roomName.getY() >= 7) {
    levelColor = 7;
  }

  if (levelColor) {
    const fillColor = config.levelColors[levelColor][`layer-${layer}`];
    sprite.setTintFill(`0x${fillColor}`);
  }
}

function tintShallow(sprite: GameObject, roomName: RoomName) {
  tint(sprite, roomName, '2');
}

function tintDeep(sprite: GameObject, roomName: RoomName) {
  tint(sprite, roomName, '1');
}

export { tintShallow, tintDeep };
