import { useEffect, useRef } from 'react';

/**
 * Manages focus after route changes for accessibility.
 * Moves focus to the main content area when the route changes,
 * ensuring screen readers announce the new page content.
 */
export const useFocusOnRouteChange = (currentRoute: string) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip focus management on initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Small delay to allow the new page to render
    const timer = setTimeout(() => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus({ preventScroll: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentRoute]);
};
