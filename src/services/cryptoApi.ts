
import { toast } from "sonner";

export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

const API_BASE_URL = "https://api.coingecko.com/api/v3";
let lastFetchAttempt = 0;
const COOLDOWN_PERIOD = 60000; // 1 minute cooldown

// Fallback data to use when API is unavailable
const FALLBACK_DATA: Cryptocurrency[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 63584,
    market_cap: 1245765386484,
    market_cap_rank: 1,
    fully_diluted_valuation: 1335044336927,
    total_volume: 23898722462,
    high_24h: 64869,
    low_24h: 63016,
    price_change_24h: 372.14,
    price_change_percentage_24h: 0.58876,
    market_cap_change_24h: 7838336719,
    market_cap_change_percentage_24h: 0.63371,
    circulating_supply: 19600431,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 69045,
    ath_change_percentage: -7.93845,
    ath_date: "2021-11-10T14:24:11.849Z",
    atl: 67.81,
    atl_change_percentage: 93641.17076,
    atl_date: "2013-07-06T00:00:00.000Z",
    last_updated: new Date().toISOString()
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3074.27,
    market_cap: 369421715047,
    market_cap_rank: 2,
    fully_diluted_valuation: 369421715047,
    total_volume: 15689267560,
    high_24h: 3139.07,
    low_24h: 3041.29,
    price_change_24h: -26.06767479134295,
    price_change_percentage_24h: -0.84166,
    market_cap_change_24h: -3091431472.3515625,
    market_cap_change_percentage_24h: -0.82997,
    circulating_supply: 120176657.357532,
    total_supply: 120176657.357532,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -36.9955,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 709946.8036,
    atl_date: "2015-10-20T00:00:00.000Z",
    last_updated: new Date().toISOString()
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 148.02,
    market_cap: 63877429124,
    market_cap_rank: 5,
    fully_diluted_valuation: 81721293130,
    total_volume: 3169806797,
    high_24h: 154.69,
    low_24h: 143.79,
    price_change_24h: -1.5231621033758843,
    price_change_percentage_24h: -1.01883,
    market_cap_change_24h: -645984833.0350952,
    market_cap_change_percentage_24h: -1.00131,
    circulating_supply: 431828731.539958,
    total_supply: 552440671.075229,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -43.06606,
    ath_date: "2021-11-06T21:54:35.825Z",
    atl: 0.500801,
    atl_change_percentage: 29455.28029,
    atl_date: "2020-05-11T19:35:23.449Z",
    last_updated: new Date().toISOString()
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.455578,
    market_cap: 16039841889,
    market_cap_rank: 9,
    fully_diluted_valuation: 20500991781,
    total_volume: 365235614,
    high_24h: 0.463982,
    low_24h: 0.444691,
    price_change_24h: -0.00040462797872874827,
    price_change_percentage_24h: -0.08881,
    market_cap_change_24h: -31131345.78454399,
    market_cap_change_percentage_24h: -0.19392,
    circulating_supply: 35204541553.653,
    total_supply: 45000000000,
    max_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -85.25741,
    ath_date: "2021-09-02T06:00:10.474Z",
    atl: 0.01925275,
    atl_change_percentage: 2264.38072,
    atl_date: "2020-03-13T02:22:55.044Z",
    last_updated: new Date().toISOString()
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.151642,
    market_cap: 21799097998,
    market_cap_rank: 9,
    fully_diluted_valuation: null,
    total_volume: 1149353431,
    high_24h: 0.153794,
    low_24h: 0.148261,
    price_change_24h: 0.00225859,
    price_change_percentage_24h: 1.51126,
    market_cap_change_24h: 319493877,
    market_cap_change_percentage_24h: 1.48756,
    circulating_supply: 143820376383.705,
    total_supply: null,
    max_supply: null,
    ath: 0.731578,
    ath_change_percentage: -79.27613,
    ath_date: "2021-05-08T05:08:23.458Z",
    atl: 0.0000869,
    atl_change_percentage: 174502.77097,
    atl_date: "2015-05-06T00:00:00.000Z",
    last_updated: new Date().toISOString()
  }
];

export const fetchTopCryptos = async (count: number = 20): Promise<Cryptocurrency[]> => {
  const now = Date.now();
  
  try {
    // Don't hammer the API if we just got an error
    if (now - lastFetchAttempt < COOLDOWN_PERIOD) {
      console.log("Using fallback data due to recent fetch failure");
      toast.info("CoinGecko API is cooling down. Using cached data.", {
        duration: 3000,
        id: "api-cooldown" // Prevent multiple toasts
      });
      return FALLBACK_DATA;
    }
    
    lastFetchAttempt = now;
    
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false`,
      { 
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status === 429) {
      // Rate limit exceeded
      console.log("Rate limit exceeded, using fallback data");
      toast.error("API rate limit exceeded. Using cached data instead.", {
        duration: 3000,
        id: "rate-limit" // Prevent multiple toasts
      });
      return FALLBACK_DATA;
    }
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error);
    
    // Only show toast once
    toast.error("Failed to fetch cryptocurrency data. Using cached data.", {
      duration: 3000,
      id: "fetch-error" // Prevent multiple toasts
    });
    
    return FALLBACK_DATA;
  }
};

export const searchCryptos = async (query: string): Promise<Cryptocurrency[]> => {
  try {
    const now = Date.now();
    
    // Don't hammer the API if we just got an error
    if (now - lastFetchAttempt < COOLDOWN_PERIOD) {
      console.log("Using fallback search data due to recent fetch failure");
      
      // Filter fallback data based on search query
      const results = FALLBACK_DATA.filter(crypto => 
        crypto.name.toLowerCase().includes(query.toLowerCase()) || 
        crypto.symbol.toLowerCase().includes(query.toLowerCase())
      );
      
      return results.length > 0 ? results : FALLBACK_DATA;
    }
    
    lastFetchAttempt = now;
    
    // First search for the coins that match the query
    const searchResponse = await fetch(
      `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`,
      { 
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (searchResponse.status === 429) {
      // Rate limit exceeded - filter fallback data
      const results = FALLBACK_DATA.filter(crypto => 
        crypto.name.toLowerCase().includes(query.toLowerCase()) || 
        crypto.symbol.toLowerCase().includes(query.toLowerCase())
      );
      
      return results.length > 0 ? results : FALLBACK_DATA;
    }
    
    if (!searchResponse.ok) {
      throw new Error(`API Error: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    // If no coins found, return empty array
    if (searchData.coins.length === 0) {
      return [];
    }
    
    // Get the ids of the first 5 matching coins
    const coinIds = searchData.coins.slice(0, 5).map((coin: any) => coin.id).join(",");
    
    // Fetch detailed data for these coins
    const detailsResponse = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false`,
      { 
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!detailsResponse.ok) {
      throw new Error(`API Error: ${detailsResponse.status}`);
    }
    
    return await detailsResponse.json();
  } catch (error) {
    console.error("Error searching cryptocurrencies:", error);
    
    // Only show toast once
    toast.error("Failed to search cryptocurrencies. Using cached data.", {
      duration: 3000,
      id: "search-error" // Prevent multiple toasts
    });
    
    // Filter fallback data
    const results = FALLBACK_DATA.filter(crypto => 
      crypto.name.toLowerCase().includes(query.toLowerCase()) || 
      crypto.symbol.toLowerCase().includes(query.toLowerCase())
    );
    
    return results.length > 0 ? results : FALLBACK_DATA;
  }
};
