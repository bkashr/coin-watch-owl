// Background script for HimCoin extension
const API_BASE_URL = "https://api.coingecko.com/api/v3";

chrome.runtime.onInstalled.addListener(() => {
  console.log('HimCoin extension installed');
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CRYPTO_DATA') {
    fetchCryptoData(message.count || 50)
      .then(data => {
        console.log('Successfully fetched crypto data');
        sendResponse({ success: true, data });
      })
      .catch(error => {
        console.error('Error fetching crypto data:', error);
        sendResponse({ 
          success: false, 
          error: error.message,
          fallback: true // Indicate that fallback data should be used
        });
      });
    return true; // Will respond asynchronously
  }
});

async function fetchCryptoData(count: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&sparkline=false`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from API');
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchCryptoData:', error);
    throw error;
  }
} 