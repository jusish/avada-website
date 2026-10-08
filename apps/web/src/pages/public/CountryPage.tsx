import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { KenyaPage } from '@/pages/public/KenyaPage';
import { RwandaPage } from '@/pages/public/RwandaPage';
import { TanzaniaPage } from '@/pages/public/TanzaniaPage';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, CheckCircle2, Building, CreditCard, Radio } from 'lucide-react';
import { CountryFlag } from '@/components/CountryFlag';

export const CountryPage: React.FC = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const { countries, loading } = useSiteConfig();

  if (!countrySlug) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-sm font-semibold text-gray-500">Invalid country parameter.</p>
      </div>
    );
  }

  const slug = countrySlug.toLowerCase().trim();

  // Bespoke pages for primary launch markets
  if (slug === 'kenya' || slug === 'ke') return <KenyaPage />;
  if (slug === 'rwanda' || slug === 'rw') return <RwandaPage />;
  if (slug === 'tanzania' || slug === 'tz') return <TanzaniaPage />;

  // Search in dynamic countries from CMS
  const country = countries.find((c) => c.slug.toLowerCase() === slug || c.code.toLowerCase() === slug);

  if (!country && !loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center mx-auto">
            <Building className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#2A292D]">Market Expanding Soon</h2>
          <p className="text-sm text-gray-600">
            AvadaPay is currently obtaining regulatory licensing and telco connectivity in this region.
          </p>
          <div className="pt-2">
            <Link to="/contact">
              <Button className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold rounded-xl text-sm">
                Inquire About Regional Launch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3BBA93]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#2A292D] font-sans pb-24">
      {/* 1 — Top Hero */}
      <section className="bg-[#2A292D] text-white pt-24 sm:pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white">
            <CountryFlag country={country.code} className="w-5 h-3.5" />
            <span>Operational Market</span>
            <span>•</span>
            <span className="text-[#3BBA93] font-mono">{country.currencyCode}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-[1.12]">
            {country.headline}
          </h1>

          {country.tagline && (
            <p className="text-lg sm:text-xl text-[#3BBA93] font-bold max-w-2xl">
              {country.tagline}
            </p>
          )}

          <p className="text-base sm:text-lg text-white/80 max-w-2xl font-medium leading-relaxed">
            {country.description}
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link to={`/contact?country=${encodeURIComponent(country.name)}`}>
              <Button className="h-12 px-8 rounded-xl bg-[#3BBA93] hover:bg-[#32a481] text-white font-black text-sm shadow-lg shadow-[#3BBA93]/20">
                Connect in {country.name}
              </Button>
            </Link>
            <Link to="/contact?inquiry=api">
              <Button variant="outline" className="h-12 px-6 rounded-xl border-white/20 text-white hover:bg-white/10 bg-transparent font-bold text-sm">
                View API Specs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2 — Supported Telco Partners & Payment Rails */}
      <section className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Telco Partners */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-[#2A292D]">Integrated Carriers</h3>
            </div>
            <p className="text-xs text-gray-500">Direct mobile network operator connectivity with instant STK push & callbacks.</p>
            <div className="space-y-2 pt-2">
              {country.telcoPartners.map((partner, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm font-bold text-[#2A292D]">
                  <CheckCircle2 className="w-4 h-4 text-[#3BBA93] flex-shrink-0" />
                  <span>{partner}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Rails */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#3BBA93]/15 text-[#3BBA93] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-[#2A292D]">Supported Payment Rails</h3>
            </div>
            <p className="text-xs text-gray-500">Omnichannel processing across mobile money, card networks, and bank transfers.</p>
            <div className="space-y-2 pt-2">
              {country.paymentRails.map((rail, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm font-bold text-[#2A292D]">
                  <CheckCircle2 className="w-4 h-4 text-[#3BBA93] flex-shrink-0" />
                  <span>{rail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Pricing Summary Banner */}
      {country.pricingSummary && (
        <section className="max-w-5xl mx-auto px-4 mt-12">
          <div className="bg-[#E3F5EE] border-2 border-[#3BBA93]/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#248767]">Transparent Pricing</p>
              <h4 className="text-xl font-black text-[#2A292D] mt-1">{country.pricingSummary}</h4>
            </div>
            <Link to={`/contact?country=${encodeURIComponent(country.name)}&inquiry=payments`}>
              <Button className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-extrabold rounded-xl px-6 h-11 text-xs">
                Request Rate Sheet
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* 4 — Head Office Location & Interactive Map */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-[#3BBA93]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Head Office Location</span>
              </div>
              <h3 className="text-2xl font-black text-[#2A292D] mt-1">AvadaPay {country.name} Office</h3>
            </div>
            <Link to={`/contact?country=${encodeURIComponent(country.name)}`}>
              <Button variant="outline" className="border-[#3BBA93] text-[#3BBA93] hover:bg-[#3BBA93] hover:text-white font-bold rounded-xl text-xs">
                Schedule a Visit
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
            {/* Contact Details */}
            <div className="space-y-6">
              {country.officeAddress && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Physical Address</p>
                  <p className="text-sm font-semibold text-[#2A292D] leading-relaxed">
                    {country.officeAddress}
                  </p>
                </div>
              )}

              {country.officePhone && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Direct Phone</p>
                  <a
                    href={`tel:${country.officePhone.replace(/\s+/g, '')}`}
                    className="text-sm font-bold text-[#3BBA93] hover:underline flex items-center space-x-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{country.officePhone}</span>
                  </a>
                </div>
              )}

              {country.officeEmail && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Regional Support Email</p>
                  <a
                    href={`mailto:${country.officeEmail}`}
                    className="text-sm font-bold text-[#3BBA93] hover:underline flex items-center space-x-2"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{country.officeEmail}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Interactive Map Embed */}
            {country.mapEmbedUrl ? (
              <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                <iframe
                  title={`${country.name} Office Map`}
                  src={country.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="w-full h-64 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-semibold">
                Map coordinates will be displayed once updated in the CMS
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
