import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered reveal animations
 * Uses IntersectionObserver for performant scroll detection
 */
export function useScrollReveal(options = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [elementRef, isVisible];
}

/**
 * Hook for staggered reveal animations on a list of elements
 */
export function useStaggeredReveal(count, options = {}) {
  const [visibleIndices, setVisibleIndices] = useState(new Set());
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the reveal of children
          for (let i = 0; i < count; i++) {
            setTimeout(() => {
              setVisibleIndices(prev => new Set([...prev, i]));
            }, i * 100);
          }
          observer.unobserve(container);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [count]);

  return [containerRef, visibleIndices];
}