import { useState, useEffect, useRef } from 'react';
import PriceFetcher from './priceFetch';
import Trade from './trade';

function App() {
  const [priceData, setPriceData] = useState({
    currentPrice: null,
    shortSMA: null,
    longSMA: null,
    trades: []
  });

  const tradeRef = useRef(null);
  const fetcherRef = useRef(new PriceFetcher());

  useEffect(() => {
    // Initialize trade tracker with callback
    tradeRef.current = new Trade((trade) => {
      setPriceData(prev => ({
        ...prev,
        trades: [trade, ...prev.trades]
      }));
    });

    const fetchAndProcess = async () => {
      const price = await fetcherRef.current.fetchPrice();
      if (price !== null) {
        setPriceData(prev => ({
          ...prev,
          currentPrice: price,
          shortSMA: tradeRef.current.shortSMA.average(),
          longSMA: tradeRef.current.longSMA.average()
        }));
        tradeRef.current.addPrice(price);
      }
    };

    // Initial fetch
    fetchAndProcess();

    // Set up interval
    const interval = setInterval(fetchAndProcess, 60000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>Bitcoin Price Tracker</h1>
      
      <div className="current-values">
        {priceData.currentPrice !== null ? (
          <div className="price-display">
            <h2>Current Price: ${priceData.currentPrice.toFixed(2)}</h2>
            <div className="sma-display">
              <div>5-period SMA: {priceData.shortSMA?.toFixed(2) || 'Calculating...'}</div>
              <div>20-period SMA: {priceData.longSMA?.toFixed(2) || 'Calculating...'}</div>
            </div>
          </div>
        ) : (
          <p>Loading price...</p>
        )}
      </div>

      <div className="trade-history">
        <h3>Trading Signals</h3>
        {priceData.trades.length === 0 ? (
          <p>No trades yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {priceData.trades.map((trade, index) => (
                <tr key={index} className={trade.type}>
                  <td>{new Date(trade.timestamp).toLocaleTimeString()}</td>
                  <td>{trade.type.toUpperCase()}</td>
                  <td>${trade.price.toFixed(2)}</td>
                  <td>{trade.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;