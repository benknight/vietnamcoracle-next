import { useEffect } from 'react';

export default function useWaitCursor(isLoading?: boolean) {
  useEffect(() => {
    const root = window.document.querySelector('html');

    if (!root) return;

    root.style.cursor = isLoading ? 'wait' : '';

    return () => {
      root.style.cursor = '';
    };
  }, [isLoading]);
}
