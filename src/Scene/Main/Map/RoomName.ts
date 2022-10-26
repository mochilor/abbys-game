export default class RoomName {
  private x: number;

  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static fromName(name: string): RoomName {
    const parsedName = name.split('_');

    const x = parsedName[0] ?? null;
    const y = parsedName[1] ?? null;

    if (!x || !y) {
      throw new Error('Invalid room name provided');
    }

    return new RoomName(parseInt(x, 10), parseInt(y, 10));
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getName(): string {
    return `${this.x}_${this.y}`;
  }

  public isSame(roomData: { x: number, y: number }): boolean {
    return this.x === roomData.x && this.y === roomData.y;
  }
}
