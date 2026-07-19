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

        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="y3RNc-UfL5d1OHtf5yKYej6AwqkRySGjNyhuUAPlOJs" />

        <link rel="icon" href="/icons/logo.ico" />
        <link rel="shortcut icon" href="/icons/logo.ico" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://api.vercel.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Google Analytics */}
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
        
        {/* AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3976598981288611"
          strategy="afterInteractive"
          crossOrigin="anonymous"
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
