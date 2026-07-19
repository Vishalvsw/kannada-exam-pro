import Head from 'next/head';
import { useRouter } from 'next/router';
export default function SEO({ title, description, keywords = '', canonical, image = '/icons/logo.ico', type = 'website', publishedTime, modifiedTime, author = 'Kannada Exam Pro', robots = 'index, follow' }) {
  const router = useRouter();
  const siteUrl = 'https://www.kannadaexampro.com';
  const currentUrl = canonical || `${siteUrl}${router.asPath}`;
  const defaultTitle = 'ಕನ್ನಡ ಎಕ್ಸಾಂ ಪ್ರೋ - ಕೆಎಎಸ್ | ಪಿಎಸ್ಐ | ಪಿಡಿಒ ಪರೀಕ್ಷಾ ತಯಾರಿ';
  const finalTitle = title ? `${title} | Kannada Exam Pro` : defaultTitle;
  const finalDescription = description || 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಂವಾದಾತ್ಮಕ ರಸಪ್ರಶ್ನೆಗಳೊಂದಿಗೆ ತಯಾರಿ ಮಾಡಿ';
  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={currentUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Kannada Exam Pro" />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      <meta name="author" content={author} />
      <link rel="alternate" href={currentUrl} hrefLang="x-default" />
      <link rel="alternate" href={currentUrl} hrefLang="kn" />
    </Head>
  );
}
