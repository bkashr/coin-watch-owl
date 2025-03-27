
import React, { useState } from "react";
import { getAlerts, removeAlert, PriceAlert } from "@/services/alertService";
import { formatPrice } from "@/lib/formatters";
import { Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

const AlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>(getAlerts());
  const [open, setOpen] = useState(false);
  
  const refreshAlerts = () => {
    setAlerts(getAlerts());
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      refreshAlerts();
    }
    setOpen(isOpen);
  };
  
  const handleRemoveAlert = (alertId: string) => {
    removeAlert(alertId);
    refreshAlerts();
    toast.success("Alert removed");
  };
  
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <Bell className="h-4 w-4" /> Alerts {alerts.length > 0 && `(${alerts.length})`}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Price Alerts</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {alerts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No price alerts set. Add alerts from any cryptocurrency card.
            </p>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="border rounded-md p-4 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{alert.cryptoName} ({alert.cryptoSymbol.toUpperCase()})</h4>
                      <p className="text-sm text-muted-foreground">
                        Alert when price goes {alert.isAbove ? "above" : "below"} {formatPrice(alert.targetPrice)}
                      </p>
                      {alert.purchaseUrl && (
                        <a 
                          href={alert.purchaseUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline mt-1 block"
                        >
                          View purchase page
                        </a>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AlertsManager;
