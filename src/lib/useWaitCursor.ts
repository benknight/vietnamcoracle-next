import { useEffect } from 'react';

export default function useWaitCursor(isLoading?: boolean) {
  useEffect(() => {
    window.document.querySelector('html').style.cursor = isLoading
      ? 'wait'
      : '';
    return () => {
      window.document.querySelector('html').style.cursor = '';
    };
  }, [isLoading]);
}
