export interface GameItem {
  id: number,
  x: number,
  y: number,
  properties: {
    name: string,
    value: number | string,
  }[],
}
