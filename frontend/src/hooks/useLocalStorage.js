import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const update = (next) => {
    setValue(next);
    try {
      if (next === null || next === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(next));
      }
    } catch {
      // storage might be full or blocked, chat still works without persistence
    }
  };

  return [value, update];
}
