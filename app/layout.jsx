// app/layout.jsx
import { DemoAuthProvider } from '@/components/DemoAuth';
import ResponsiveNav from '@/components/ResponsiveNav';
import Footer from '@/components/Footer';
import ClientOnly from '@/components/ClientOnly';
import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'ಕನ್ನಡ ಎಕ್ಸಾಂ ಪ್ರೋ - ಕೆಎಎಸ್ | ಪಿಎಸ್ಐ | ಪಿಡಿಒ ಪರೀಕ್ಷಾ ತಯಾರಿ',
  description: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಂವಾದಾತ್ಮಕ ರಸಪ್ರಶ್ನೆಗಳೊಂದಿಗೆ ತಯಾರಿ ಮಾಡಿ',
  metadataBase: new URL('https://www.kannadaexampro.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'ಕನ್ನಡ ಎಕ್ಸಾಂ ಪ್ರೋ - ಕೆಎಎಸ್ | ಪಿಎಸ್ಐ | ಪಿಡಿಒ',
    description: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಂವಾದಾತ್ಮಕ ರಸಪ್ರಶ್ನೆಗಳು, ಅಧ್ಯಯನ ಟಿಪ್ಪಣಿಗಳು ಮತ್ತು ಪ್ರಸ್ತುತ ವಿದ್ಯಮಾನಗಳು',
    url: 'https://www.kannadaexampro.com',
    siteName: 'Kannada Exam Pro',
    images: [{ url: '/icons/logo.ico', width: 800, height: 600, alt: 'Kannada Exam Pro Logo' }],
    locale: 'kn_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ಕನ್ನಡ ಎಕ್ಸಾಂ ಪ್ರೋ - ಕೆಎಎಸ್ | ಪಿಎಸ್ಐ | ಪಿಡಿಒ',
    description: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಂವಾದಾತ್ಮಕ ರಸಪ್ರಶ್ನೆಗಳು',
    images: ['/icons/logo.ico'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: { google: 'y3RNc-UfL5d1OHtf5yKYej6AwqkRySGjNyhuUAPlOJs' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: '#3B82F6',
};

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-9119771130084938';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-M47FVGQELK';
const AD_UNIT = process.env.NEXT_PUBLIC_AD_UNIT || '/23369396230/MCQup';
const AD_DIV_ID = process.env.NEXT_PUBLIC_AD_DIV_ID || 'div-gpt-ad-1788864007233-0';

export default function RootLayout({ children }) {
  return (
    <html lang="kn" suppressHydrationWarning>
      <head>
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="icon" href="/icons/logo.ico" />
        <link rel="shortcut icon" href="/icons/logo.ico" />
        <link rel="apple-touch-icon" href="/icons/logo.ico" />
        
        <link rel="dns-prefetch" href="https://api.vercel.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ✅ Google Ad Manager (GPT) - Fixed */}
        <Script
          async
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* ✅ GPT Initialization - Updated */}
        <Script id="gpt-init" strategy="afterInteractive">
          {`
            window.googletag = window.googletag || {cmd: []};
            googletag.cmd.push(function() {
              // ✅ New config method
              googletag.setConfig({
                singleRequest: true
              });
              googletag.defineSlot('${AD_UNIT}', [[320, 100], [320, 50]], '${AD_DIV_ID}')
                .addService(googletag.pubads());
              googletag.enableServices();
            });
          `}
        </Script>
        
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
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>
        
        {/* ✅ Google AdSense - Fixed */}
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          strategy="afterInteractive"
        />
      </head>
      <body suppressHydrationWarning>
        <ClientOnly>
          <DemoAuthProvider>
            <ResponsiveNav>{children}</ResponsiveNav>
            <Footer />
          </DemoAuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}