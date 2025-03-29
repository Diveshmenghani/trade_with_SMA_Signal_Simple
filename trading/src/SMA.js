export default class SMA {
  constructor(size) {
    this.size = size;
    this.buffer = new Array(size).fill(null);
    this.head = 0;
    this.count = 0;
    this.sum = 0;
  }

  add(value) {
    if (this.count < this.size) {
      this.sum += value;
      this.buffer[this.head] = value;
      this.head = (this.head + 1) % this.size;
      this.count++;
    } else {
      const oldestValue = this.buffer[this.head];
      this.sum += value - oldestValue;
      this.buffer[this.head] = value;
      this.head = (this.head + 1) % this.size;
    }
  }

  average() {
    if (this.count === 0) return 0;
    return this.sum / Math.min(this.count, this.size);
  }

  isFull() {
    return this.count >= this.size;
  }
}