import Script from 'next/script';
export default function StructuredData({ type, data }) {
  const baseUrl = 'https://www.kannadaexampro.com';
  const getSchema = () => {
    switch (type) {
      case 'Organization':
        return { '@context': 'https://schema.org', '@type': 'Organization', name: 'Kannada Exam Pro', url: baseUrl, logo: `${baseUrl}/icons/logo.ico`, description: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಂವಾದಾತ್ಮಕ ರಸಪ್ರಶ್ನೆಗಳೊಂದಿಗೆ ತಯಾರಿ ಮಾಡಿ', contactPoint: { '@type': 'ContactPoint', email: 'support@kannadaexampro.com', contactType: 'customer support' }, sameAs: ['https://www.instagram.com/kannada_exam_pro'] };
      case 'Website':
        return { '@context': 'https://schema.org', '@type': 'WebSite', url: baseUrl, name: 'Kannada Exam Pro', description: 'KAS, PSI, PDO, FDA, SDA ಪರೀಕ್ಷಾ ತಯಾರಿ ವೇದಿಕೆ', potentialAction: { '@type': 'SearchAction', target: `${baseUrl}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } };
      case 'Breadcrumb':
        return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: data.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${baseUrl}${item.url}` })) };
      case 'Article':
        return { '@context': 'https://schema.org', '@type': 'Article', headline: data.title, description: data.description, image: data.image || `${baseUrl}/icons/logo.ico`, datePublished: data.publishedTime, dateModified: data.modifiedTime || data.publishedTime, author: { '@type': 'Person', name: data.author || 'Kannada Exam Pro' }, publisher: { '@type': 'Organization', name: 'Kannada Exam Pro', logo: { '@type': 'ImageObject', url: `${baseUrl}/icons/logo.ico` } } };
      case 'FAQ':
        return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: data.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) };
      default: return null;
    }
  };
  const schema = getSchema();
  if (!schema) return null;
  return <Script id={`structured-data-${type}`} type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
