/**
 * Interface with minimal information needed to instantiate real game objects
 */
export default interface GameItem {
  uuid: string,
  id: number,
  x: number,
  y: number,
  key: string,
  rotation: number,
  properties: {
    name: string,
    value: number | string,
  }[],
}
