
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
    return [];
  }
};

export const isInWatchlist = (coinId: string): boolean => {
  const watchlist = getWatchlist();
  return watchlist.includes(coinId);
};
