import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Avadapay provides next-generation financial infrastructure, omni-channel payment processing, smart POS terminals, and high-throughput bulk SMS built for modern African enterprises and global businesses.',
  canonical,
  keywords,
  ogType = 'website',
  ogImage = 'https://avadapay.com/og-image.png',
  structuredData,
  noindex = false,
}) => {
  useEffect(() => {
    // 1. Page Title
    const formattedTitle = title
      ? title.toLowerCase().includes('avadapay')
        ? title
        : `${title} | Avadapay`
      : 'Avadapay | Global Financial Infrastructure & Technology';
    document.title = formattedTitle;

    // Helper to get or create meta tag
    const setMetaTag = (attribute: string, name: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Meta Description & Keywords
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // 3. Robots
    setMetaTag(
      'name',
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // 4. Canonical URL
    const canonicalUrl = canonical
      ? canonical.startsWith('http')
        ? canonical
        : `https://avadapay.com${canonical.startsWith('/') ? canonical : `/${canonical}`}`
      : 'https://avadapay.com/';
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 5. Open Graph
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);

    // 6. Twitter
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 7. Route-specific Structured Data
    const scriptId = 'route-structured-data';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (structuredData) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      const data = Array.isArray(structuredData)
        ? { '@context': 'https://schema.org', '@graph': structuredData }
        : { '@context': 'https://schema.org', ...structuredData };
      scriptElement.textContent = JSON.stringify(data);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, canonical, keywords, ogType, ogImage, structuredData, noindex]);

  return null;
};
