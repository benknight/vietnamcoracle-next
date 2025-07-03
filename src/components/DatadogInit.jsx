'use client';
import { initDatadog } from '@/lib/datadog';
import { useEffect } from 'react';

export default function DatadogInit() {
  useEffect(() => {
    initDatadog();
  }, []);

  return null;
}
