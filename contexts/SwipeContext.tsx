import React, { createContext, useContext, useState } from 'react';

interface SwipeContextType {
  swipedItemId: string | null;
  setSwipedItemId: (id: string | null) => void;
}

const SwipeContext = createContext<SwipeContextType | null>(null);

export function SwipeProvider({ children }: { children: React.ReactNode }) {
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);

  return (
    <SwipeContext.Provider value={{ swipedItemId, setSwipedItemId }}>
      {children}
    </SwipeContext.Provider>
  );
}

export const useSwipe = () => {
  const context = useContext(SwipeContext);
  if (!context) {
    throw new Error('useSwipe must be used within a SwipeProvider');
  }
  return context;
}; 