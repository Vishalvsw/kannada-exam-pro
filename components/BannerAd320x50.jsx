'use client';

import { useEffect, useRef, useState } from 'react';

const loadedKeys = new Set();

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

    if (container.querySelector('iframe')) {
      setLoaded(true);
      return;
    }

    if (loadedKeys.has(adKey)) {
      console.log(`[BannerAd] Skipping duplicate key: ${adKey.slice(0, 8)}...`);
      return;
    }
    loadedKeys.add(adKey);

    window.atOptions = {
      key: adKey,
      format: 'iframe',
      height,
      width,
      params: {},
    };

    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.src = `https://bauval.org/22/${adKey}`;
    adScript.async = true;

    adScript.onload = () => {
      setLoaded(true);
      setTimeout(() => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
          console.log(`✅ Adsterra rendered: ${width}×${height} key=${adKey.slice(0, 8)}...`);
        } else {
          console.warn(`⚠️ Adsterra loaded but no iframe — key=${adKey.slice(0, 8)}...`);
        }
      }, 2500);
    };

    adScript.onerror = () => {
      console.warn(`[BannerAd] Failed: ${adKey.slice(0, 8)}...`);
      loadedKeys.delete(adKey);
    };

    container.appendChild(adScript);
  }, [adKey, width, height]);

  return (
    <div
      className={`flex justify-center items-center my-2 ${className}`}
      style={{
        minHeight: `${height}px`,
        minWidth: `${width}px`,
        ...style,
      }}
      aria-label="Advertisement"
    >
      {!loaded && (
        <span className="text-xs text-gray-400 animate-pulse">Loading ad…</span>
      )}
      <div
        ref={containerRef}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  );
}