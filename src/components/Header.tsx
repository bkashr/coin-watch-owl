<<<<<<< HEAD
=======

>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a
import React from "react";
import { Bitcoin, RefreshCw, AlertTriangle, Clock, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AlertsManager from "./AlertsManager";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/useTheme";

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: Date | null;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing, lastUpdated }) => {
  const isCached = localStorage.getItem("using_fallback_data") === "true";
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-2">
        <Bitcoin className="h-6 w-6 text-crypto-bitcoin" />
<<<<<<< HEAD
        <span className="font-bold text-lg text-foreground">CoinWatch</span>
=======
        <span className="font-bold text-lg">CoinWatch</span>
>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a
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
<<<<<<< HEAD
                <div className="flex items-center text-xs text-foreground/80 mr-2">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Last data refresh time</p>
=======
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
>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <Button
<<<<<<< HEAD
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="text-foreground hover:text-foreground/80"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-foreground hover:text-foreground/80"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
=======
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="p-2 mr-2"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className={cn("p-2", isRefreshing && "opacity-70")}
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a
        </Button>
      </div>
    </header>
  );
};

export default Header;
