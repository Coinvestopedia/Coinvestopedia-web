// src/components/PageMeta.tsx
// SEO meta tags for every page.
// Requires: npm install react-helmet-async
// Wrap App in: <HelmetProvider>...</HelmetProvider>

import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  structuredData?: object;
  additionalStructuredData?: object[];
}

const SITE_NAME = 'Coinvestopedia';
const DEFAULT_OG_IMAGE = 'https://coinvestopedia.com/og-default.png';
const BASE_URL = 'https://coinvestopedia.com';

export function PageMeta({
  title,
  description,
  canonical,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  structuredData,
  additionalStructuredData,
}: PageMetaProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical
    ? `${BASE_URL}${canonical}`
    : typeof window !== 'undefined' ? window.location.href : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* OpenGraph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@coinvestopedia" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      {additionalStructuredData?.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}

// ── Pre-built structured data schemas ──────────────────────

export const toolsPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Coinvestopedia Crypto & Investment Simulators',
  url: `${BASE_URL}/tools`,
  applicationCategory: 'FinanceApplication',
  description: 'Free institutional-grade crypto and investment simulators: ROI, DCA, Sharpe ratio, position sizing, compound interest and more.',
  featureList: [
    'ROI Simulator with CAGR',
    'Dollar Cost Averaging (DCA) Simulator',
    'Sharpe & Sortino Ratio Tool',
    'Kelly Criterion Position Sizer',
    'Compound Interest Simulator',
    'Break-even Price Simulator',
    'Profit & Loss Simulator',
  ],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: BASE_URL,
  description: 'World-class institutional crypto data, analysis, and investment tools.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const articleSchema = (article: {
  title: string;
  description: string;
  datePublished: string;
  authorName: string;
  image?: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  image: article.image || DEFAULT_OG_IMAGE,
  datePublished: article.datePublished,
  author: {
    '@type': 'Organization',
    name: article.authorName,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo-dark-full.png`,
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': article.url,
  },
});

export const faqSchema = (questions: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map((q) => ({
    '@type': 'Question',
    name: q.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.a,
    },
  })),
});

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: BASE_URL,
  logo: `${BASE_URL}/logo-dark-full.png`,
  description: 'World-class institutional crypto data, analysis, and investment tools.',
  sameAs: [
    'https://twitter.com/coinvestopedia',
  ],
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: `${BASE_URL}/newsletter`,
  },
};

export const itemListSchema = (items: { name: string; url: string; position: number }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((item) => ({
    '@type': 'ListItem',
    position: item.position,
    name: item.name,
    url: item.url,
  })),
});
