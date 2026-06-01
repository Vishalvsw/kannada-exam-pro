'use client';

import { useEffect, useState } from 'react';

export default function ResponsiveLayout({ children }) {
  const [deviceType, setDeviceType] = useState('mobile');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) setDeviceType('mobile');
      else if (width <= 768) setDeviceType('tablet');
      else if (width <= 1024) setDeviceType('desktop');
      else setDeviceType('wide');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`device-${deviceType}`}>
      {children}
    </div>
  );
}
