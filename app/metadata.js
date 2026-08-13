// app/metadata.js
export const metadata = {
  title: 'ಕನ್ನಡ ಎಕ್ಸಾಂ ಪ್ರೋ - ಕೆಎಎಸ್ | ಪಿಎಸ್ಐ | ಪಿಡಿಒ ಪರೀಕ್ಷಾ ತಯಾರಿ',
  description: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಂವಾದಾತ್ಮಕ ರಸಪ್ರಶ್ನೆಗಳೊಂದಿಗೆ ತಯಾರಿ ಮಾಡಿ',
  metadataBase: new URL('https://www.kannadaexampro.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ಕನ್ನಡ ಎಕ್ಸಾಂ ಪ್ರೋ - ಕೆಎಎಸ್ | ಪಿಎಸ್ಐ | ಪಿಡಿಒ',
    description: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಂವಾದಾತ್ಮಕ ರಸಪ್ರಶ್ನೆಗಳು, ಅಧ್ಯಯನ ಟಿಪ್ಪಣಿಗಳು ಮತ್ತು ಪ್ರಸ್ತುತ ವಿದ್ಯಮಾನಗಳು',
    url: 'https://www.kannadaexampro.com',
    siteName: 'Kannada Exam Pro',
    images: [
      {
        url: '/icons/logo.ico',
        width: 800,
        height: 600,
        alt: 'Kannada Exam Pro Logo',
      },
    ],
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
  verification: {
    google: 'y3RNc-UfL5d1OHtf5yKYej6AwqkRySGjNyhuUAPlOJs',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: '#3B82F6',
};