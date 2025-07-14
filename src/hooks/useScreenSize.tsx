'use client';

import { useEffect, useState } from 'react';

interface ScreenFlags {
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
}

const getFlags = (width: number): ScreenFlags => {
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 768,
    isLaptop: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
};

const useScreenSize = (): ScreenFlags => {
  const [flags, setFlags] = useState<ScreenFlags>({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      setFlags(getFlags(window.innerWidth));
    };

    // Run once on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return flags;
};

export default useScreenSize;
