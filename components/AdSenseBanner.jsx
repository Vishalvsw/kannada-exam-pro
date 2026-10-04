// components/BannerAd320x50.jsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function BannerAd320x50({
  adKey = 'a2ad75aded5a9dd54c993b9731bd9df9',
  width = 320,
  height = 50,
  className = '',
  style = {},
}) {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent duplicate injection (React 18 Strict Mode / re-renders)
    if (container.dataset.loaded === 'true') return;
    container.dataset.loaded = 'true';

    // Clear any previous content (safety)
    container.innerHTML = '';

    // 1. atOptions config — must be set BEFORE loading the ad script
    const optionsScript = document.createElement('script');
    optionsScript.type = 'text/javascript';
    optionsScript.text = `atOptions = ${JSON.stringify({
      key: adKey,
      format: 'iframe',
      height,
      width,
      params: {},
    })};`;

    // 2. Load the Adsterra invoke script
    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = `https://bauval.org/22/${adKey}`;
    adScript.async = true;

    // Mark as loaded once script is injected
    adScript.onload = () => setLoaded(true);
    adScript.onerror = () => {
      console.warn('[BannerAd] Failed to load ad script:', adKey);
    };

    container.appendChild(optionsScript);
    container.appendChild(adScript);

    // Cleanup on unmount
    return () => {
      if (container) {
        container.innerHTML = '';
        container.dataset.loaded = 'false';
      }
      // Clean up global atOptions so the next ad slot works
      try {
        delete window.atOptions;
      } catch (_) {}
    };
  }, [adKey, width, height]);

  return (
    <div
      className={`flex justify-center items-center my-4 ${className}`}
      style={{
        minHeight: `${height}px`,
        minWidth: `${width}px`,
        ...style,
      }}
      aria-label="Advertisement"
    >
      {!loaded && (
        <span className="text-xs text-gray-400 animate-pulse">
          Loading ad…
        </span>
      )}
      <div
        ref={containerRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: loaded ? 'block' : 'none',
        }}
      />
    </div>
  );
}