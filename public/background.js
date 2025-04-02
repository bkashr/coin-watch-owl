// Background service worker for CoinWatch extension

// Check price alerts every 5 minutes
const CHECK_INTERVAL = 5 * 60 * 1000;

// Initialize alarms when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('checkPrices', { periodInMinutes: 5 });
});

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkPrices') {
    checkPriceAlerts();
  }
});

async function checkPriceAlerts() {
  try {
    // Get all alerts from storage
    const { alerts = [] } = await chrome.storage.local.get('alerts');
    
    // Get current prices for all cryptocurrencies in alerts
    const cryptoIds = [...new Set(alerts.map(alert => alert.cryptoId))];
    const prices = await fetchPrices(cryptoIds);
    
    // Check each alert
    for (const alert of alerts) {
      const currentPrice = prices[alert.cryptoId]?.current_price;
      if (!currentPrice) continue;
      
      const shouldTrigger = alert.isAbove 
        ? currentPrice >= alert.targetPrice
        : currentPrice <= alert.targetPrice;
      
      if (shouldTrigger) {
        // Show notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Price Alert Triggered!',
          message: `${alert.cryptoName} (${alert.cryptoSymbol.toUpperCase()}) has reached your target price of ${alert.targetPrice}`
        });
        
        // Remove the triggered alert
        const updatedAlerts = alerts.filter(a => a.id !== alert.id);
        await chrome.storage.local.set({ alerts: updatedAlerts });
      }
    }
  } catch (error) {
    console.error('Error checking price alerts:', error);
  }
}

async function fetchPrices(cryptoIds) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching prices:', error);
    return {};
  }
} 