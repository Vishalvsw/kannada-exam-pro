// app/layout.jsx
import { DemoAuthProvider } from '@/components/DemoAuth';
import ResponsiveNav from '@/components/ResponsiveNav';
import Footer from '@/components/Footer';
import ClientOnly from '@/components/ClientOnly';
import BannerAd320x50 from '@/components/BannerAd320x50';  // ✅ THIS LINE WAS MISSING
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: { google: 'y3RNc-UfL5d1OHtf5yKYej6AwqkRySGjNyhuUAPlOJs' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: '#3B82F6',
};

// ✅ Google Analytics
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-M47FVGQELK';

export default function RootLayout({ children }) {
  return (
    <html lang="kn" suppressHydrationWarning>
      <head>
        {/* ===== Icons & Sitemap ===== */}
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="icon" href="/icons/logo.ico" />
        <link rel="shortcut icon" href="/icons/logo.ico" />
        <link rel="apple-touch-icon" href="/icons/logo.ico" />

        {/* ===== Domain Verification ===== */}
        <meta name="profiton-domain-verification" content="c759445c472db95db5da2fb73c70dcf9d23763b37bccc8f2e5f01757dc4678bb" />

        {/* ===== DNS Prefetch ===== */}
        <link rel="dns-prefetch" href="https://api.vercel.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://securepubads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://bauval.org" />

        {/* ===== Preconnect Fonts ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* =====================================================
            ✅ Google Ad Manager (GPT) — AdX
           ===================================================== */}
        <Script
          async
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Script id="gpt-init" strategy="afterInteractive">
          {`
            window.googletag = window.googletag || { cmd: [] };
            window.googletag.cmd = window.googletag.cmd || [];
            window.googletag.cmd.push(function () {
              window.googletag.setConfig({ singleRequest: true });
              window.googletag.pubads().enableAsyncRendering();
              window.googletag.enableServices();
            });
          `}
        </Script>

        {/* =====================================================
            ✅ Google Analytics (GA4)
           ===================================================== */}
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
      </head>

      <body suppressHydrationWarning>
        <ClientOnly>
          <DemoAuthProvider>
            <ResponsiveNav>{children}</ResponsiveNav>

            {/* =====================================================
                ✅ Adsterra 320×50 Banner — shows on every page
               ===================================================== */}
            <div className="flex justify-center items-center py-4 bg-gray-50 border-t border-gray-200">
              <BannerAd320x50 />
            </div>

            <Footer />
          </DemoAuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}