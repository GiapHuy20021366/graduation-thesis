export class GrowMatrix {
  matrix: Set<string>;
  orders: [number, number][];

  constructor() {
    this.matrix = new Set();
    this.orders = [];
    this.grow([0, 0]);
  }

  grow([x, y]: [number, number]) {
    const point: [number, number] = [x, y];
    const top: [number, number] = [x, y - 1];
    const botton: [number, number] = [x, y + 1];
    const left: [number, number] = [x - 1, y];
    const right: [number, number] = [x + 1, y];
    const topleft: [number, number] = [x - 1, y - 1];
    const topright: [number, number] = [x + 1, y - 1];
    const bottonleft: [number, number] = [x - 1, y + 1];
    const bottomRight: [number, number] = [x + 1, y + 1];

    !this.has(point) && this.push(point);
    !this.has(top) && this.push(top);
    !this.has(botton) && this.push(botton);
    !this.has(left) && this.push(left);
    !this.has(right) && this.push(right);
    !this.has(topleft) && this.push(topleft);
    !this.has(topright) && this.push(topright);
    !this.has(bottonleft) && this.push(bottonleft);
    !this.has(bottomRight) && this.push(bottomRight);
  }

  push([x, y]: [number, number]) {
    this.matrix.add(`${x}|${y}`);
    this.orders.push([x, y]);
  }

  has([x, y]: [number, number]) {
    return this.matrix.has(`${x}|${y}`);
  }

  next(): [number, number] | undefined {
    return this.orders.shift();
  }
}