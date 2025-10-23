'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useBootState() {
  const [hasBooted, setHasBooted] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated
    setIsHydrated(true);

    // Check if user has already seen the boot screen in the last 24 hours
    const hasSeenBootScreen = Cookies.get('hasSeenBootScreen');

    if (hasSeenBootScreen === 'true') {
      // Already seen boot screen recently, skip it
      setHasBooted(true);
      setIsBooting(false);
    } else {
      // First visit or 24+ hours since last visit, show boot screen
      const timer = setTimeout(() => {
        setHasBooted(true);
        setIsBooting(false);
        // Set cookie with 24-hour expiry
        Cookies.set('hasSeenBootScreen', 'true', {
          expires: 1, // 1 day
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });
      }, 3000); // 3 seconds boot screen duration

      return () => clearTimeout(timer);
    }
  }, []);

  return { hasBooted, isBooting, isHydrated };
}