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

  public equals(roomName: this) {
    return this.x === roomName.getX() && this.y === roomName.getY();
  }
}
