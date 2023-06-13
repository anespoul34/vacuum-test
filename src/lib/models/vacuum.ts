export enum Directions {
  North = "N",
  East = "E",
  South = "S",
  West = "W"
};

export class Vacuum {
  public x: number;
  public y: number;
  public area: number;
  public rotation: number = 180;
  public orientation: Directions;

  constructor(x: number, y: number, dir: Directions, area: number) {
    this.x = x;
    this.y = y;
    this.orientation = dir;
    this.area = area;
  }

  public getCurrentPosition(): any {
    return {
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      message: `Position: ${this.x}, ${this.y} | Orientation: ${this.orientation}`
    }
  }

  public processInstruction(instruction: string) {
    switch (instruction) {
      case 'A':
        this.move();
        break;
      case 'G':
        this.rotateLeft();
        break;
      case 'D':
        this.rotateRight();
        break;
      default:
        return;
    }
  }

  private rotateLeft(): void {
    this.rotation -= 90;
    switch(this.orientation) {
      case 'N':
        this.orientation = Directions.West;
        break;
      case 'E':
        this.orientation = Directions.North;
        break;
      case 'S':
        this.orientation = Directions.East;
        break;
      case 'W':
        this.orientation = Directions.South;
        break;
      default:
        return;
    }
  }

  private rotateRight(): void {
    this.rotation += 90;
    switch(this.orientation) {
      case 'N':
        this.orientation = Directions.East;
        break;
      case 'E':
        this.orientation = Directions.South;
        break;
      case 'S':
        this.orientation = Directions.West;
        break;
      case 'W':
        this.orientation = Directions.North;
        break;
      default:
        return;
    }
  }

  private move(): void {
    switch(this.orientation) {
      case 'N':
        if (this.y == 0) return
        this.y -= 1;
        break;
      case 'E':
        if (this.x == (this.area - 1)) return
        this.x += 1;
        break;
      case 'S':
        if (this.y == (this.area - 1)) return
        this.y += 1;
        break;
      case 'W':
        if (this.x == 0) return
        this.x -= 1;
        break;
      default:
        return;
    }
  }
}