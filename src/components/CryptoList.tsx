import React, { useState, useEffect } from "react";
import { Cryptocurrency } from "@/services/cryptoApi";
import CryptoCard from "./CryptoCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getWatchlist } from "@/services/storageService";

interface CryptoListProps {
  cryptos: Cryptocurrency[];
  isLoading: boolean;
  onSearch: (query: string) => void;
}

const CryptoList: React.FC<CryptoListProps> = ({ cryptos, isLoading, onSearch }) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const list = await getWatchlist();
        setWatchlistIds(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error('Error loading watchlist:', error);
        setWatchlistIds([]);
      }
    };
    loadWatchlist();
  }, []);

  const handleWatchlistUpdate = async () => {
    try {
      const list = await getWatchlist();
      setWatchlistIds(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error updating watchlist:', error);
      setWatchlistIds([]);
    }
  };

  const filteredCryptos = activeTab === "watchlist" 
    ? cryptos.filter(crypto => watchlistIds.includes(crypto.id))
    : cryptos;

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Cryptocurrency Tracker</h2>
        <Input 
          placeholder="Search cryptocurrencies..." 
          className="max-w-xs"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="all">All Coins</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 animate-pulse">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-20 bg-muted rounded-md animate-pulse-subtle"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {cryptos.map((crypto) => (
                <CryptoCard 
                  key={crypto.id} 
                  crypto={crypto} 
                  onWatchlistUpdate={handleWatchlistUpdate}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="watchlist" className="mt-4">
          {filteredCryptos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No cryptocurrencies in your watchlist. Add some by clicking the star icon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCryptos.map((crypto) => (
                <CryptoCard 
                  key={crypto.id} 
                  crypto={crypto} 
                  onWatchlistUpdate={handleWatchlistUpdate}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CryptoList;
