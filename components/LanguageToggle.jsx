'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
      aria-label="Toggle language"
    >
      {language === 'kn' ? (
        <>
          <span>🇮🇳</span>
          <span className="hidden sm:inline">English</span>
          <span className="sm:hidden">EN</span>
        </>
      ) : (
        <>
          <span>🇮🇳</span>
          <span className="hidden sm:inline">ಕನ್ನಡ</span>
          <span className="sm:hidden">ಕ</span>
        </>
      )}
    </button>
  );
}
