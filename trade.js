import SMA from './SMA';

class Trade {
  constructor() {
    this.shortBuffer = new SMA(5);
    this.longBuffer = new SMA(20);
    this.prevShort = null;
    this.prevLong = null;
  }

  addPrice(price) {
    this.shortBuffer.add(price);
    this.longBuffer.add(price);

    if (this.longBuffer.isFull) {
      const currentShort = this.shortBuffer.average;
      const currentLong = this.longBuffer.average;

      if (this.prevShort !== null && this.prevLong !== null) {
        if (this.prevShort < this.prevLong && currentShort > currentLong) {
          this.logTrade('buy', price);
        } else if (this.prevShort > this.prevLong && currentShort < currentLong) {
          this.logTrade('sell', price);
        }
      }

      [this.prevShort, this.prevLong] = [currentShort, currentLong];
    }
  }

  logTrade(type, price) {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      price,
      quantity: 1
    };
    fs.appendFileSync('trades.log', `${JSON.stringify(entry)}\n`);
    console.log('Trade executed:', entry);
  }
}

module.exports = Trade;