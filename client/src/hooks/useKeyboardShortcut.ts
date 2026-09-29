import { useEffect } from 'react';

export const useKeyboardShortcut = (
  key: string,
  callback: (e: KeyboardEvent) => void,
  options: { metaKey?: boolean; ctrlKey?: boolean; altKey?: boolean } = {}
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const matchKey = e.key.toLowerCase() === key.toLowerCase();
      const matchMeta = options.metaKey ? e.metaKey || e.ctrlKey : true;

      if (matchKey && matchMeta) {
        e.preventDefault();
        callback(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, options]);
};
