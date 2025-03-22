import priceFetch from './priceFetch.js';
import Trade from './trade.js';


const fetcher = new priceFetch();
const trader = new Trade();

async function fetchAndProcess() {
  const price = await fetcher.fetchPrice();
  if (price !== null) {
    console.log(`Fetched price: $${price}`);
    trader.addPrice(price);
  }
}

fetchAndProcess();
setInterval(fetchAndProcess, 60000);