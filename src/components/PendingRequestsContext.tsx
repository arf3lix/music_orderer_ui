import { createContext } from 'react';

export const PendingRequestsContext = createContext<{
  pending: number;
  increment: () => void;
  decrement: () => void;
}>({
  pending: 0,
  increment: () => {},
  decrement: () => {},
});
