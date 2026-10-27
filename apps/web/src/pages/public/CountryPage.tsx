import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { KenyaPage } from '@/pages/public/KenyaPage';
import { RwandaPage } from '@/pages/public/RwandaPage';
import { TanzaniaPage } from '@/pages/public/TanzaniaPage';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import { CountryFlag } from '@/components/CountryFlag';
import { SEO } from '@/components/seo/SEO';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

interface ComingSoonProps {
  countryName: string;
  slug: string;
  flagCode: string;
}

const CountryComingSoon: React.FC<ComingSoonProps> = ({ countryName, slug, flagCode }) => (
  <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-center">
    <SEO
      title={`Avadapay ${countryName} | Coming Soon`}
      description={`AvadaPay is currently establishing direct telco connectivity and mobile money rails across ${countryName}.`}
      canonical={`/${slug}`}
    />
    <div className="max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-4">
      <div className="w-16 h-16 rounded-full bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center mx-auto">
        <Building className="w-8 h-8" />
      </div>
      <div className="flex items-center justify-center space-x-2.5">
        <CountryFlag country={flagCode} className="w-6 h-4" />
        <h2 className="text-2xl font-black text-[#2A292D]">{countryName} — Coming Soon</h2>
      </div>
      <p className="text-sm text-gray-600">
        AvadaPay is currently establishing direct telco connectivity and mobile money rails across {countryName}. Stay tuned or contact our team for early access.
      </p>
      <div className="pt-2">
        <Button asChild className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold rounded-xl text-sm">
          <Link to={`/contact?country=${encodeURIComponent(countryName)}`}>
            Inquire About {countryName} Launch
          </Link>
        </Button>
      </div>
    </div>
  </div>
);

export const CountryPage: React.FC = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();

  if (!countrySlug) {
    return <NotFoundPage />;
  }

  const slug = countrySlug.toLowerCase().trim();

  // DRC external portal redirect as requested by client
  if (slug === 'drc' || slug === 'cd' || slug === 'congo' || slug.includes('d.r')) {
    window.location.replace('https://avadapay.cd');
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A292D] text-white p-6 text-center">
        <div className="space-y-4">
          <div className="w-8 h-8 border-2 border-[#3BBA93] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Redirecting to AvadaPay DRC portal (avadapay.cd)...</p>
          <a href="https://avadapay.cd" className="text-xs text-[#3BBA93] underline font-bold">
            Click here if not redirected automatically
          </a>
        </div>
      </div>
    );
  }

  // Benin: Coming soon state
  if (slug === 'benin' || slug === 'bj') {
    return <CountryComingSoon countryName="Benin" slug="benin" flagCode="benin" />;
  }

  // Burundi: Coming soon state
  if (slug === 'burundi' || slug === 'bi' || slug === 'bu') {
    return <CountryComingSoon countryName="Burundi" slug="burundi" flagCode="burundi" />;
  }

  // Bespoke pages for primary launch markets
  if (slug === 'kenya' || slug === 'ke') return <KenyaPage />;
  if (slug === 'rwanda' || slug === 'rw') return <RwandaPage />;
  if (slug === 'tanzania' || slug === 'tz') return <TanzaniaPage />;

  // Any non-supported countries (e.g. uae, togo, arbitrary slugs) return 404
  return <NotFoundPage />;
};
