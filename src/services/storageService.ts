/// <reference types="chrome"/>

export const getWatchlist = async (): Promise<string[]> => {
  try {
    const { watchlist = [] } = await chrome.storage.local.get('watchlist');
    return watchlist;
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
};

export const addToWatchlist = async (cryptoId: string): Promise<void> => {
  try {
    const watchlist = await getWatchlist();
    if (!watchlist.includes(cryptoId)) {
      await chrome.storage.local.set({
        watchlist: [...watchlist, cryptoId]
      });
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error);
  }
};

export const removeFromWatchlist = async (cryptoId: string): Promise<void> => {
  try {
    const watchlist = await getWatchlist();
    await chrome.storage.local.set({
      watchlist: watchlist.filter(id => id !== cryptoId)
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
  }
};

export const isInWatchlist = async (coinId: string): Promise<boolean> => {
  try {
    const watchlist = await getWatchlist();
    return watchlist.includes(coinId);
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};
