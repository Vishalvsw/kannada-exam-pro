'use client';

import { useEffect } from 'react';

export default function GptAd({
  divId = process.env.NEXT_PUBLIC_GPT_DIV_ID || 'div-gpt-ad-1789651646990-0',
  width = 320,
  height = 50,
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.googletag = window.googletag || { cmd: [] };
    window.googletag.cmd.push(function () {
      window.googletag.display(divId);
    });
  }, [divId]);

  return (
    <div
      id={divId}
      style={{ minWidth: width, minHeight: height, margin: '0 auto' }}
    />
  );
}