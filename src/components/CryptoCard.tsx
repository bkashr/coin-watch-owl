
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cryptocurrency } from "@/services/cryptoApi";
import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { isInWatchlist, saveToWatchlist, removeFromWatchlist } from "@/services/storageService";
import { toast } from "sonner";
import { formatPrice } from "@/lib/formatters";

interface CryptoCardProps {
  crypto: Cryptocurrency;
  onWatchlistUpdate: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, onWatchlistUpdate }) => {
  const [inWatchlist, setInWatchlist] = React.useState<boolean>(isInWatchlist(crypto.id));
  
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (inWatchlist) {
      removeFromWatchlist(crypto.id);
      setInWatchlist(false);
      toast.success(`${crypto.name} removed from watchlist`);
    } else {
      saveToWatchlist(crypto.id);
      setInWatchlist(true);
      toast.success(`${crypto.name} added to watchlist`);
    }
    
    onWatchlistUpdate();
  };
  
  return (
    <Card className="group cursor-pointer relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={crypto.image} 
            alt={crypto.name} 
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{crypto.name}</span>
              <span className="text-muted-foreground text-xs uppercase">{crypto.symbol}</span>
            </div>
            <span className="font-medium">{formatPrice(crypto.current_price)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div 
            className={cn(
              "flex items-center text-sm font-medium",
              crypto.price_change_percentage_24h >= 0 
                ? "text-crypto-positive" 
                : "text-crypto-negative"
            )}
          >
            {crypto.price_change_percentage_24h >= 0 ? (
              <TrendingUp className="mr-1 h-4 w-4" />
            ) : (
              <TrendingDown className="mr-1 h-4 w-4" />
            )}
            <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
          </div>
          
          <Star 
            className={cn(
              "h-5 w-5 cursor-pointer transition-colors",
              inWatchlist ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"
            )}
            onClick={handleWatchlistToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoCard;
