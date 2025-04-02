<<<<<<< HEAD
/// <reference types="chrome"/>

export const getWatchlist = async (): Promise<string[]> => {
  try {
    const { watchlist = [] } = await chrome.storage.local.get('watchlist');
    return watchlist;
  } catch (error) {
    console.error('Error getting watchlist:', error);
=======

export const saveToWatchlist = (coinId: string): string[] => {
  // Get current watchlist
  const currentWatchlist = getWatchlist();
  
  // Check if already in watchlist
  if (!currentWatchlist.includes(coinId)) {
    // Add to watchlist
    const newWatchlist = [...currentWatchlist, coinId];
    localStorage.setItem('crypto-watchlist', JSON.stringify(newWatchlist));
    return newWatchlist;
  }
  
  return currentWatchlist;
};

export const removeFromWatchlist = (coinId: string): string[] => {
  // Get current watchlist
  const currentWatchlist = getWatchlist();
  
  // Remove from watchlist
  const newWatchlist = currentWatchlist.filter(id => id !== coinId);
  localStorage.setItem('crypto-watchlist', JSON.stringify(newWatchlist));
  
  return newWatchlist;
};

export const getWatchlist = (): string[] => {
  const watchlist = localStorage.getItem('crypto-watchlist');
  
  if (!watchlist) {
    return [];
  }
  
  try {
    return JSON.parse(watchlist);
  } catch (error) {
    console.error('Error parsing watchlist from localStorage:', error);
>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a
    return [];
  }
};

<<<<<<< HEAD
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
=======
export const isInWatchlist = (coinId: string): boolean => {
  const watchlist = getWatchlist();
  return watchlist.includes(coinId);
>>>>>>> d008fd004d969d09894b64d4d2247ff805d8217a
};
