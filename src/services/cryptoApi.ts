
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

export const fetchTopCryptos = async (count: number = 20): Promise<Cryptocurrency[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error);
    toast.error("Failed to fetch cryptocurrency data");
    return [];
  }
};

export const searchCryptos = async (query: string): Promise<Cryptocurrency[]> => {
  try {
    // First search for the coins that match the query
    const searchResponse = await fetch(
      `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
    );
    
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
      `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false`
    );
    
    if (!detailsResponse.ok) {
      throw new Error(`API Error: ${detailsResponse.status}`);
    }
    
    return await detailsResponse.json();
  } catch (error) {
    console.error("Error searching cryptocurrencies:", error);
    toast.error("Failed to search for cryptocurrencies");
    return [];
  }
};
