import { useState } from 'react';

export const usePartialState = function <T>(defaultState: T): [T, (state: Partial<T>) => void] {
  const [state, setFullState] = useState<T>(defaultState);
  const setState = (partialState: Partial<T>): void => {
    setFullState({
      ...state,
      ...partialState,
    });
  };
  return [state, setState] as [T, (state: Partial<T>) => void];
};
