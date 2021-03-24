import { useEffect } from 'react';

export default function useWaitCursor(isLoading) {
  useEffect(() => {
    window.document.querySelector('body').style.cursor = isLoading
      ? 'wait'
      : '';
    return () => (window.document.querySelector('body').style.cursor = '');
  }, [isLoading]);
}
