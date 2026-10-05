'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { shouldShowAds } from '@/lib/adConfig';

let adCounter = 0;

export default function GptAd({
  adUnit = process.env.NEXT_PUBLIC_GPT_UNIT || '/23369396230/MCQ_ad',
  sizes = [[320, 100], [320, 50]],
  className = '',
  style = {},
}) {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const slotRef = useRef(null);
  const idRef = useRef(`div-gpt-ad-${Date.now()}-${++adCounter}`);
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShow(shouldShowAds('gpt', pathname || '/'));
  }, [pathname]);

  useEffect(() => {
    if (!mounted || !show) return;

    let cancelled = false;

    window.googletag = window.googletag || { cmd: [] };
    window.googletag.cmd = window.googletag.cmd || [];

    window.googletag.cmd.push(() => {
      if (cancelled || !containerRef.current) return;

      try {
        const pubads = window.googletag.pubads();
        const existing = pubads
          .getSlots()
          .find((slot) => slot.getSlotElementId() === idRef.current);

        if (existing) {
          slotRef.current = existing;
          window.googletag.display(idRef.current);
          return;
        }

        const slot = window.googletag
          .defineSlot(adUnit, sizes, idRef.current)
          ?.addService(pubads);

        if (!slot) return;
        slotRef.current = slot;
        window.googletag.display(idRef.current);
      } catch (error) {
        console.error('GPT error:', error);
      }
    });

    return () => {
      cancelled = true;
      if (slotRef.current && window.googletag) {
        window.googletag.cmd.push(() => {
          try {
            window.googletag.destroySlots([slotRef.current]);
          } catch {}
        });
      }
      slotRef.current = null;
    };
  }, [adUnit, JSON.stringify(sizes), mounted, show]);

  if (!mounted || !show) return null;

  return (
    <div
      ref={containerRef}
      className={`ad-banner ${className}`}
      style={{
        width: '100%',
        maxWidth: '320px',
        minHeight: '50px',
        margin: '0 auto',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        id={idRef.current}
        style={{ width: '100%', minHeight: '50px', margin: '0 auto' }}
      />
    </div>
  );
}