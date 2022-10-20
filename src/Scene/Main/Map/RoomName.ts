export default class RoomName {
  private x: number;

  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
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
