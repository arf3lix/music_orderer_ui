import { useState, useCallback } from 'react';
import { PendingRequestsContext } from './PendingRequestsContext';

export function PendingRequestsProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(0);

  const increment = useCallback(() => setPending(p => p + 1), []);
  const decrement = useCallback(() => setPending(p => Math.max(0, p - 1)), []);

  return (
    <PendingRequestsContext.Provider value={{ pending, increment, decrement }}>
      {children}
    </PendingRequestsContext.Provider>
  );
}
