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

export const getAlerts = async (): Promise<PriceAlert[]> => {
  try {
    const result = await chrome.storage.local.get(ALERTS_STORAGE_KEY);
    return result[ALERTS_STORAGE_KEY] || [];
  } catch (error) {
    console.error('Error getting alerts:', error);
    return [];
  }
};

export const saveAlert = async (alert: PriceAlert): Promise<void> => {
  try {
    const alerts = await getAlerts();
    alerts.push(alert);
    await chrome.storage.local.set({ [ALERTS_STORAGE_KEY]: alerts });
  } catch (error) {
    console.error('Error saving alert:', error);
    throw error;
  }
};

export const addAlert = async (alert: Omit<PriceAlert, 'id'>): Promise<void> => {
  try {
    const alerts = await getAlerts();
    const newAlert = {
      ...alert,
      id: crypto.randomUUID()
    };
    await chrome.storage.local.set({
      alerts: [...alerts, newAlert]
    });
  } catch (error) {
    console.error('Error adding alert:', error);
  }
};

export const removeAlert = async (alertId: string): Promise<void> => {
  try {
    const alerts = await getAlerts();
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    await chrome.storage.local.set({ [ALERTS_STORAGE_KEY]: updatedAlerts });
  } catch (error) {
    console.error('Error removing alert:', error);
    throw error;
  }
};

export const checkPriceAlerts = async (cryptos: any[]): Promise<void> => {
  try {
    const alerts = await getAlerts();
    const cryptoPrices = new Map(
      cryptos.map(crypto => [crypto.id, crypto.current_price])
    );

    for (const alert of alerts) {
      const currentPrice = cryptoPrices.get(alert.cryptoId);
      if (!currentPrice) continue;

      const shouldTrigger = alert.isAbove
        ? currentPrice >= alert.targetPrice
        : currentPrice <= alert.targetPrice;

      if (shouldTrigger) {
        // Show notification
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Price Alert Triggered!',
          message: `${alert.cryptoName} (${alert.cryptoSymbol.toUpperCase()}) has reached your target price of ${alert.targetPrice}`
        });

        // Remove the triggered alert
        await removeAlert(alert.id);
      }
    }
  } catch (error) {
    console.error('Error checking price alerts:', error);
  }
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
