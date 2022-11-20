import maplist from '../../assets/maplist.json';

function mapFiles(): [string, string][] {
  return Object.entries(maplist);
}

function roomNames(): string[] {
  return Object.keys(maplist);
}

export { mapFiles, roomNames };
