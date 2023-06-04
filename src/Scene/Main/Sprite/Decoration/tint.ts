import RoomName from '../../Map/RoomName';
import config from '../../../../../config/config.json';
import GameObject from '../GameObject';

function tint(sprite: GameObject, roomName: RoomName, color: string): void {
  const fillColor = config.levelColors[roomName.zone()][color] ?? null;
  if (fillColor) {
    const fill = `0x${fillColor}`;
    sprite.setTintFill(parseInt(fill, 16));
  }
}

function tintShallow(sprite: GameObject, roomName: RoomName) {
  tint(sprite, roomName, 'layer-2');
}

function tintDeep(sprite: GameObject, roomName: RoomName) {
  tint(sprite, roomName, 'layer-1');
}

function tintText(sprite: GameObject, roomName: RoomName) {
  tint(sprite, roomName, 'text');
}

export { tintShallow, tintDeep, tintText };
