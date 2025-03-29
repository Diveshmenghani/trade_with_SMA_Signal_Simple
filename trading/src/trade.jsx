import SMA from './SMA';

export default class Trade {
  constructor(onTradeCallback) {
    this.shortSMA = new SMA(5);
    this.longSMA = new SMA(20);
    this.prevShort = null;
    this.prevLong = null;
    this.onTrade = onTradeCallback;
  }

  addPrice(price) {
    this.shortSMA.add(price);
    this.longSMA.add(price);

    if (this.longSMA.isFull()) {
      const currentShort = this.shortSMA.average();
      const currentLong = this.longSMA.average();

      if (this.prevShort !== null && this.prevLong !== null) {
        const previousRelation = this.prevShort - this.prevLong;
        const currentRelation = currentShort - currentLong;

        if (previousRelation < 0 && currentRelation > 0) {
          this.logTrade('buy', price);
        } else if (previousRelation > 0 && currentRelation < 0) {
          this.logTrade('sell', price);
        }
      }

      this.prevShort = currentShort;
      this.prevLong = currentLong;
    }
  }

  logTrade(type, price) {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      price,
      quantity: 1
    };
    this.onTrade(entry);
    console.log('Trade executed:', entry);
  }
}