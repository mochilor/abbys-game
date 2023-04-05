import RoomName from '../../Map/RoomName';
import { VirtualGameItemRepository, VirtualGameItem } from './types';

const items: VirtualGameItem[] = [];

export default function makeVirtualGameItemRepository(): VirtualGameItemRepository {
  function add(virtualGameItem: VirtualGameItem): void {
    for (let n = 0; n < items.length; n += 1) {
      if (
        items[n].room === virtualGameItem.room
        && items[n].x === virtualGameItem.x
        && items[n].y === virtualGameItem.y
      ) {
        return;
      }
    }

    items.push(virtualGameItem);
  }

  function get(room: RoomName): VirtualGameItem[] {
    const foundItems = [];

    for (let n = 0; n < items.length; n += 1) {
      if (room.isSameRoom(RoomName.fromName(items[n].room))) {
        foundItems.push(items[n]);
      }
    }

    return foundItems;
  }

  return { add, get };
}
