'use client';

import { useState, useEffect } from 'react';

interface ScrollPosition {
  scrollY: number;
  isScrolled: boolean;
}

export function useScrollPosition(threshold: number = 10): ScrollPosition {
  // Initialize with safe defaults for SSR
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Try to find the main scrollable content area
    const scrollElementCandidate = document.querySelector('.overflow-y-auto') as HTMLElement;

    const getScrollPosition = () => {
      if (scrollElementCandidate) {
        return scrollElementCandidate.scrollTop;
      }
      return window.scrollY;
    };

    // Set initial scroll position on mount
    const initialScrollY = getScrollPosition();
    setScrollY(initialScrollY);
    setIsScrolled(initialScrollY > threshold);

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const currentScrollY = getScrollPosition();
        setScrollY(currentScrollY);
        setIsScrolled(currentScrollY > threshold);
      });
    };

    // Add event listener to the appropriate scroll element
    if (scrollElementCandidate) {
      scrollElementCandidate.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (scrollElementCandidate) {
        scrollElementCandidate.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [threshold]);

  return { scrollY, isScrolled };
}