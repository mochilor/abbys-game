import RoomName from '../Map/RoomName';
import MapEventsGameItemCollection from './MapEventsGameItemCollection';
import StaticGameItemCollection from './StaticGameItemCollection';

export default interface MapGameItemLocator {
  getStaticGameItemCollection: (room: RoomName) => StaticGameItemCollection;
  getMapEventsGameItemCollection(room: RoomName): MapEventsGameItemCollection;
}
