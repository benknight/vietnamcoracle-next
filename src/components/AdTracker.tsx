'use client';
import { useEffect } from 'react';

const adminAjaxUrl = 'https://cms.vietnamcoracle.com/wp-admin/admin-ajax.php';

export default function TrackingScript() {
  useEffect(() => {
    // 1. Define the async event handler function
    const handleTrackedClick = async event => {
      const link = event.currentTarget;
      const trackingData = link.getAttribute('data-track');

      const formData = new FormData();

      formData.append('action', 'adrotate_click');
      formData.append('track', trackingData);

      fetch(adminAjaxUrl, {
        method: 'POST',
        body: formData,
        keepalive: true,
      });

      console.log('Tracking requested for:', trackingData);
      // DO NOT prevent default if using sendBeacon, let navigation proceed immediately.
    };

    // 2. Select and attach the listener to all elements with 'data-track'
    const trackableLinks = document.querySelectorAll('a.gofollow[data-track]');

    trackableLinks.forEach(link => {
      link.addEventListener('click', handleTrackedClick);
    });

    // 3. Cleanup function: Remove listeners when the component unmounts
    return () => {
      trackableLinks.forEach(link => {
        link.removeEventListener('click', handleTrackedClick);
      });
    };
  }, []); // Empty dependency array ensures this runs only once

  // This component is purely for logic, so it renders nothing.
  return null;
}
