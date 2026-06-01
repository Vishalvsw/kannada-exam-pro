'use client';

import { DemoAuthProvider } from '@/components/DemoAuth';
import ResponsiveNav from '@/components/ResponsiveNav';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ClientOnly from '@/components/ClientOnly';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="kn" suppressHydrationWarning>
      <head>
        <title>ಕನ್ನಡ ಎಕ್ಸಾಂ ಪ್ರೋ - ಕೆಎಎಸ್ | ಪಿಎಸ್ಐ | ಪಿಡಿಒ ಪರೀಕ್ಷಾ ತಯಾರಿ</title>
        <meta name="description" content="ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಂವಾದಾತ್ಮಕ ರಸಪ್ರಶ್ನೆಗಳೊಂದಿಗೆ ತಯಾರಿ ಮಾಡಿ" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body suppressHydrationWarning>
        <ClientOnly>
          <LanguageProvider>
            <DemoAuthProvider>
              <ResponsiveNav>
                {children}
              </ResponsiveNav>
              <Footer />
            </DemoAuthProvider>
          </LanguageProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
