import { useEffect } from 'react';

/**
 * Global scroll reveal observer - adds 'visible' class to .reveal elements when they enter viewport
 * Place this once in your app (e.g., in App.jsx or a layout component)
 */
export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all existing .reveal elements
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // Also observe elements added dynamically (for client-side navigation)
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.matches('.reveal')) {
              observer.observe(node);
            }
            node.querySelectorAll?.('.reveal').forEach((el) => observer.observe(el));
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}

export default ScrollReveal;