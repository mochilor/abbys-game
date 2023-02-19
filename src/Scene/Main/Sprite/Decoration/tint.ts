import RoomName from '../../Map/RoomName';
import config from '../../../../../config/config.json';
import GameObject from '../GameObject';

function tint(sprite: GameObject, roomName: RoomName, layer: string): void {
  const fillColor = config.levelColors[roomName.zone()][`layer-${layer}`] ?? null;
  if (fillColor) {
    const fill = `0x${fillColor}`;
    sprite.setTintFill(parseInt(fill, 16));
  }
}

function tintShallow(sprite: GameObject, roomName: RoomName) {
  tint(sprite, roomName, '2');
}

function tintDeep(sprite: GameObject, roomName: RoomName) {
  tint(sprite, roomName, '1');
}

export { tintShallow, tintDeep };
