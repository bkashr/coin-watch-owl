
import React from "react";
import { Bitcoin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AlertsManager from "./AlertsManager";

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: Date | null;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing, lastUpdated }) => {
  return (
    <header className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-2">
        <Bitcoin className="h-6 w-6 text-crypto-bitcoin" />
        <span className="font-bold text-lg">CoinWatch</span>
      </div>
      
      <div className="flex items-center gap-2">
        <AlertsManager />
        
        {lastUpdated && (
          <span className="text-xs text-muted-foreground mr-2">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
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
