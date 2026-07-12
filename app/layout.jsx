'use client';

import { DemoAuthProvider } from '@/components/DemoAuth';
import ResponsiveNav from '@/components/ResponsiveNav';
import Footer from '@/components/Footer';
import ClientOnly from '@/components/ClientOnly';
import Script from 'next/script';
import './globals.css';

export default function RootLayout({ children }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-M47FVGQELK';
  
  return (
    <html lang="kn" suppressHydrationWarning>
      <head>
        <title>ಕನ್ನಡ ಎಕ್ಸಾಂ ಪ್ರೋ - ಕೆಎಎಸ್ | ಪಿಎಸ್ಐ | ಪಿಡಿಒ ಪರೀಕ್ಷಾ ತಯಾರಿ</title>
        <meta name="description" content="ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಂವಾದಾತ್ಮಕ ರಸಪ್ರಶ್ನೆಗಳೊಂದಿಗೆ ತಯಾರಿ ಮಾಡಿ" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />

        <link rel="icon" href="/icons/logo.ico" />
        <link rel="shortcut icon" href="/icons/logo.ico" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* DNS Prefetch for faster external connections */}
        <link rel="dns-prefetch" href="https://api.vercel.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cmp.gatekeeperconsent.com" />
        <link rel="dns-prefetch" href="https://the.gatekeeperconsent.com" />
        <link rel="dns-prefetch" href="https://www.ezojs.com" />
        <link rel="dns-prefetch" href="//ezoicanalytics.com" />
        
        {/* ====== ✅ GOOGLE ANALYTICS ====== */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        
        {/* ====== ✅ ADSENSE SCRIPT ====== */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3976598981288611"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {/* ====== ✅ EZOIC SCRIPTS ====== */}
        {/* Consent Management Platform */}
        <Script
          src="https://cmp.gatekeeperconsent.com/min.js"
          strategy="afterInteractive"
          data-cfasync="false"
        />
        <Script
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          strategy="afterInteractive"
          data-cfasync="false"
        />
        
        {/* Ezoic SA Script */}
        <Script
          src="//www.ezojs.com/ezoic/sa.min.js"
          strategy="afterInteractive"
          async
        />
        
        {/* Ezoic Standalone Initialization */}
        <Script id="ezoic-init" strategy="afterInteractive">
          {`
            window.ezstandalone = window.ezstandalone || {};
            ezstandalone.cmd = ezstandalone.cmd || [];
          `}
        </Script>
        
        {/* Ezoic Analytics */}
        <Script
          src="//ezoicanalytics.com/analytics.js"
          strategy="afterInteractive"
        />
      </head>
      <body suppressHydrationWarning>
        <ClientOnly>
          <DemoAuthProvider>
            <ResponsiveNav>
              {children}
            </ResponsiveNav>
            <Footer />
          </DemoAuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}