'use client';
import { initDatadog } from '@/lib/datadog';
import { useEffect } from 'react';

export default function DatadogInit() {
  useEffect(() => {
    // Defer initialization until the page is idle to improve initial render performance
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => initDatadog());
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => initDatadog(), 2000);
    }
  }, []);

  return null;
}
