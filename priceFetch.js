import fetch from 'node-fetch';

class priceFetch {
  constructor(cryptoId = 'bitcoin', currency = 'usd') {
    this.baseUrl = 'https://api.coingecko.com/api/v3/simple/price';
    this.params = `ids=${cryptoId}&vs_currencies=${currency}`;
  }

  async fetchPrice() {
    try {
      const response = await fetch(`${this.baseUrl}?${this.params}`);
      const data = await response.json();
      return data.bitcoin.usd;
    } catch (error) {
      console.error('Error fetching price:', error.message);
      return null;
    }
  }
}

module.exports = priceFetch;