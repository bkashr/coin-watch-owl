
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
  
  const updateFallbackStatus = (isFallback: boolean) => {
    localStorage.setItem("using_fallback_data", isFallback.toString());
  };
  
  const fetchCryptos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTopCryptos(50);
      setCryptos(data);
      setLastUpdated(new Date());
      
      // Set fallback status based on comparing with known fallback data IDs
      const isFallback = data.length === 5 && 
        data[0].id === "bitcoin" && 
        data[1].id === "ethereum";
      updateFallbackStatus(isFallback);
      
      // Check for price alerts
      checkPriceAlerts(data);
    } catch (error) {
      updateFallbackStatus(true);
      console.error("Error in fetchCryptos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const refreshData = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (searchQuery.trim()) {
        const data = await searchCryptos(searchQuery);
        setCryptos(data);
        
        // Set fallback status based on data source
        const isFallback = data.length <= 5 && 
          data.some(c => c.id === "bitcoin" || c.id === "ethereum");
        updateFallbackStatus(isFallback);
      } else {
        const data = await fetchTopCryptos(50);
        setCryptos(data);
        
        // Set fallback status based on data source
        const isFallback = data.length === 5 && 
          data[0].id === "bitcoin" && 
          data[1].id === "ethereum";
        updateFallbackStatus(isFallback);
      }
      
      setLastUpdated(new Date());
      toast.success("Cryptocurrency data refreshed");
      
      // Check for price alerts
      checkPriceAlerts(cryptos);
    } catch (error) {
      updateFallbackStatus(true);
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, searchQuery, cryptos]);
  
  const debouncedSearch = useDebounceCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      setIsLoading(true);
      try {
        const results = await searchCryptos(query);
        setCryptos(results);
        setLastUpdated(new Date());
        
        // Set fallback status based on data source
        const isFallback = results.length <= 5 && 
          results.some(c => c.id === "bitcoin" || c.id === "ethereum");
        updateFallbackStatus(isFallback);
        
        // Check for price alerts with new results
        checkPriceAlerts(results);
      } catch (error) {
        updateFallbackStatus(true);
      } finally {
        setIsLoading(false);
      }
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
