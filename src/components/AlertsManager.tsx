import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceAlert, getAlerts, removeAlert } from "@/services/alertService";
import { formatPrice } from "@/lib/formatters";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const alerts = await getAlerts();
      setAlerts(alerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Failed to load alerts');
    }
  };

  const handleRemoveAlert = async (alertId: string) => {
    try {
      await removeAlert(alertId);
      setAlerts(alerts => alerts.filter(alert => alert.id !== alertId));
      toast.success('Alert removed successfully');
    } catch (error) {
      console.error('Error removing alert:', error);
      toast.error('Failed to remove alert');
    }
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No active price alerts.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card"
          >
            <div className="space-y-1">
              <h4 className="font-medium">
                {alert.cryptoName} ({alert.cryptoSymbol.toUpperCase()})
              </h4>
              <p className="text-sm text-muted-foreground">
                Alert when price goes {alert.isAbove ? "above" : "below"}{" "}
                {formatPrice(alert.targetPrice)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveAlert(alert.id)}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AlertsManager;
