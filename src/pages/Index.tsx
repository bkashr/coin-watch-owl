
import React, { useState, useEffect, useCallback } from "react";
import CryptoList from "@/components/CryptoList";
import Header from "@/components/Header";
import { Cryptocurrency, fetchTopCryptos, searchCryptos } from "@/services/cryptoApi";
import { useDebounceCallback } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { checkPriceAlerts } from "@/services/alertService";

// Configurable constants for API refresh intervals
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes instead of 2 minutes
const MANUAL_REFRESH_COOLDOWN = 30 * 1000; // 30 seconds cooldown for manual refreshes

const Index = () => {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lastManualRefresh, setLastManualRefresh] = useState<number>(0);
  
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
    
    const now = Date.now();
    
    // Check if manual refresh is on cooldown
    if (now - lastManualRefresh < MANUAL_REFRESH_COOLDOWN) {
      const remainingSeconds = Math.ceil((MANUAL_REFRESH_COOLDOWN - (now - lastManualRefresh)) / 1000);
      toast.info(`Please wait ${remainingSeconds} seconds before refreshing again`);
      return;
    }
    
    setIsRefreshing(true);
    setLastManualRefresh(now);
    
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
  }, [isRefreshing, searchQuery, cryptos, lastManualRefresh]);
  
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
    
    // Set up auto-refresh using the longer interval
    const interval = setInterval(() => {
      console.log("Auto-refreshing data (interval)");
      // Only refresh if not already refreshing and not in search mode
      if (!isRefreshing && !searchQuery) {
        const autoRefresh = async () => {
          setIsRefreshing(true);
          try {
            const data = await fetchTopCryptos(50);
            setCryptos(data);
            setLastUpdated(new Date());
            
            // Set fallback status
            const isFallback = data.length === 5 && 
              data[0].id === "bitcoin" && 
              data[1].id === "ethereum";
            updateFallbackStatus(isFallback);
            
            // Check for price alerts
            checkPriceAlerts(data);
          } catch (error) {
            updateFallbackStatus(true);
            console.error("Error in auto-refresh:", error);
          } finally {
            setIsRefreshing(false);
          }
        };
        
        autoRefresh();
      }
    }, AUTO_REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [fetchCryptos, isRefreshing, searchQuery]);
  
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
