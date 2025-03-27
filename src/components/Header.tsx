
import React from "react";
import { Bitcoin, RefreshCw, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AlertsManager from "./AlertsManager";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: Date | null;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing, lastUpdated }) => {
  const isCached = localStorage.getItem("using_fallback_data") === "true";
  
  return (
    <header className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-2">
        <Bitcoin className="h-6 w-6 text-crypto-bitcoin" />
        <span className="font-bold text-lg">CoinWatch</span>
      </div>
      
      <div className="flex items-center gap-2">
        <AlertsManager />
        
        {isCached && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-amber-500">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Using cached data</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>CoinGecko API is unavailable. Using cached data.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {lastUpdated && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-muted-foreground mr-2">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p>Auto-refreshes every 5 minutes</p>
                  <p>Manual refresh has 30 second cooldown</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className={cn("p-2", isRefreshing && "opacity-70")}
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
