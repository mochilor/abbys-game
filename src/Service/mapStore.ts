import maps from '../../assets/maps.json';

function mapFiles(): [string, object][] {
  return Object.entries(maps);
}

function roomNames(): string[] {
  return Object.keys(maps);
}

export { mapFiles, roomNames };
