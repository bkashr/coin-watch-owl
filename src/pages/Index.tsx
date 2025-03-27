
import React, { useState, useEffect, useCallback } from "react";
import CryptoList from "@/components/CryptoList";
import Header from "@/components/Header";
import { Cryptocurrency, fetchTopCryptos, searchCryptos } from "@/services/cryptoApi";
import { useDebounceCallback } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { checkPriceAlerts } from "@/services/alertService";

const Index = () => {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const fetchCryptos = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchTopCryptos(50);
    setCryptos(data);
    setLastUpdated(new Date());
    setIsLoading(false);
    
    // Check for price alerts
    checkPriceAlerts(data);
  }, []);
  
  const refreshData = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (searchQuery.trim()) {
        const data = await searchCryptos(searchQuery);
        setCryptos(data);
      } else {
        const data = await fetchTopCryptos(50);
        setCryptos(data);
      }
      setLastUpdated(new Date());
      toast.success("Cryptocurrency data refreshed");
      
      // Check for price alerts
      checkPriceAlerts(cryptos);
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, searchQuery, cryptos]);
  
  const debouncedSearch = useDebounceCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      setIsLoading(true);
      const results = await searchCryptos(query);
      setCryptos(results);
      setLastUpdated(new Date());
      setIsLoading(false);
      
      // Check for price alerts with new results
      checkPriceAlerts(results);
    } else {
      fetchCryptos();
    }
  }, 500);
  
  useEffect(() => {
    fetchCryptos();
    
    // Set up auto-refresh every 2 minutes
    const interval = setInterval(() => {
      refreshData();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchCryptos, refreshData]);
  
  const handleSearch = (query: string) => {
    debouncedSearch(query);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onRefresh={refreshData} 
        isRefreshing={isRefreshing} 
        lastUpdated={lastUpdated} 
      />
      <main className="flex-1 container max-w-4xl py-4 px-4">
        <CryptoList 
          cryptos={cryptos} 
          isLoading={isLoading} 
          onSearch={handleSearch} 
        />
      </main>
      <footer className="text-center py-2 text-xs text-muted-foreground border-t">
        <p>Data provided by CoinGecko API</p>
      </footer>
    </div>
  );
};

export default Index;
