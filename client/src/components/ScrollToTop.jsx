import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Extracts the current URL path
  const { pathname } = useLocation();

  // Every time the pathname changes, instantly scroll to x:0, y:0
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't render any visible UI
  return null;
};

export default ScrollToTop;