
import { toast } from "sonner";

export interface PriceAlert {
  id: string;
  cryptoId: string;
  cryptoName: string;
  cryptoSymbol: string;
  targetPrice: number;
  isAbove: boolean;
  createdAt: number;
  purchaseUrl?: string;
}

const ALERTS_STORAGE_KEY = "coinwatch_price_alerts";

export const saveAlert = (alert: PriceAlert): void => {
  const alerts = getAlerts();
  alerts.push(alert);
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
};

export const getAlerts = (): PriceAlert[] => {
  const alertsString = localStorage.getItem(ALERTS_STORAGE_KEY);
  return alertsString ? JSON.parse(alertsString) : [];
};

export const removeAlert = (alertId: string): void => {
  const alerts = getAlerts();
  const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
};

export const checkPriceAlerts = (cryptos: any[]): void => {
  const alerts = getAlerts();
  
  alerts.forEach(alert => {
    const crypto = cryptos.find(c => c.id === alert.cryptoId);
    
    if (!crypto) return;
    
    const currentPrice = crypto.current_price;
    const shouldTrigger = alert.isAbove 
      ? currentPrice >= alert.targetPrice 
      : currentPrice <= alert.targetPrice;
    
    if (shouldTrigger) {
      triggerAlert(alert, currentPrice);
      removeAlert(alert.id);
    }
  });
};

const triggerAlert = (alert: PriceAlert, currentPrice: number): void => {
  const actionType = alert.isAbove ? "above" : "below";
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(alert.targetPrice);
  
  toast(
    `${alert.cryptoName} (${alert.cryptoSymbol}) is now ${actionType} ${formattedPrice}!`,
    {
      description: "Your price alert has been triggered.",
      action: {
        label: alert.purchaseUrl ? "Buy Now" : "Dismiss",
        onClick: () => {
          if (alert.purchaseUrl) {
            window.open(alert.purchaseUrl, "_blank");
          }
        }
      },
      duration: 10000,
    }
  );
};
