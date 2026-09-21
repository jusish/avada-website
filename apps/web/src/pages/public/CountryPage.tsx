import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface CountryDetail {
  name: string;
  flag: string;
  capital: string;
  currency: string;
  regulator: string;
  description: string;
  office: string;
  email: string;
  phone: string;
  telcos: { name: string; type: string; uptime: string }[];
  features: string[];
}

const COUNTRY_DATA: Record<string, CountryDetail> = {
  kenya: {
    name: 'Kenya',
    flag: '🇰🇪',
    capital: 'Nairobi',
    currency: 'KES (Kenyan Shilling)',
    regulator: 'Central Bank of Kenya (CBK) & CAK',
    description:
      'As East Africa’s economic and financial technology capital, AvadaPay Kenya delivers direct, low-latency integration with Safaricom M-Pesa, Airtel Money, and the PesaLink interbank network.',
    office: 'AvadaPay Tower, Westlands, Nairobi, Kenya',
    email: 'kenya@avadapay.com',
    phone: '+254 20 790 3000',
    telcos: [
      { name: 'Safaricom M-Pesa (C2B & B2C)', type: 'Mobile Money Gateway', uptime: '99.99%' },
      { name: 'Airtel Money Kenya', type: 'Mobile Money Rails', uptime: '99.95%' },
      { name: 'PesaLink Real-Time Bank Rails', type: 'Instant Bank Clearing', uptime: '99.98%' },
      { name: 'Local Visa & Mastercard Acquiring', type: 'Card Payment Gateway', uptime: '99.95%' },
    ],
    features: [
      'Direct M-Pesa STK Push integration with instant webhook callbacks',
      'Automated B2C bulk salary and supplier payouts',
      'Dedicated Sender ID registration with Safaricom and Airtel',
      'Real-time automated reconciliation via central dashboard',
    ],
  },
  rwanda: {
    name: 'Rwanda',
    flag: '🇷🇼',
    capital: 'Kigali',
    currency: 'RWF (Rwandan Franc)',
    regulator: 'National Bank of Rwanda (NBR) & RURA',
    description:
      'Powering Rwanda’s cashless economy and digital acceleration. AvadaPay Rwanda connects seamlessly to MTN Mobile Money, Airtel Money, and local commercial banking switches.',
    office: 'Kigali Innovation City, Gasabo District, Kigali, Rwanda',
    email: 'rwanda@avadapay.com',
    phone: '+250 788 123 456',
    telcos: [
      { name: 'MTN Mobile Money Rwanda (MoMo)', type: 'Direct Telco Host Integration', uptime: '99.98%' },
      { name: 'Airtel Money Rwanda', type: 'Mobile Money Aggregation', uptime: '99.92%' },
      { name: 'R-Switch National Interbank', type: 'Domestic Payment Switch', uptime: '99.96%' },
      { name: 'Bank of Kigali & Equity Acquiring', type: 'Card & POS Processing', uptime: '99.94%' },
    ],
    features: [
      'Instant USSD Push & MoMo Open API collections',
      'High-throughput bulk disburse to Rwandan mobile numbers',
      'Shortcode and Sender ID delivery under RURA compliance',
      'In-store smart POS deployment across Kigali retail hubs',
    ],
  },
  tanzania: {
    name: 'Tanzania',
    flag: '🇹🇿',
    capital: 'Dar es Salaam',
    currency: 'TZS (Tanzanian Shilling)',
    regulator: 'Bank of Tanzania (BOT) & TCRA',
    description:
      'Serving Tanzania’s multi-telco ecosystem with unified payment aggregation spanning Vodacom M-Pesa, Tigo Pesa, Airtel Money, and HaloPesa.',
    office: 'Peninsula Commercial Hub, Masaki, Dar es Salaam, Tanzania',
    email: 'tanzania@avadapay.com',
    phone: '+255 22 260 4000',
    telcos: [
      { name: 'Vodacom M-Pesa Tanzania', type: 'Tier-1 Direct Connection', uptime: '99.97%' },
      { name: 'Tigo Pesa (Mixx by Yas)', type: 'Mobile Money Gateway', uptime: '99.94%' },
      { name: 'Airtel Money Tanzania', type: 'Direct Telco Rail', uptime: '99.95%' },
      { name: 'HaloPesa (Halotel)', type: 'Nationwide Mobile Network', uptime: '99.91%' },
    ],
    features: [
      'Universal single API bridging all 4 Tanzanian telco operators',
      'Automated TIPSS (Tanzania Instant Payment System) settlement',
      'Multi-carrier Bulk SMS routing with TCRA compliance',
      'Cross-border corridor payouts into Kenya and Rwanda',
    ],
  },
};

export const CountryPage: React.FC = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();

  if (!countrySlug || !COUNTRY_DATA[countrySlug.toLowerCase()]) {
    return <Navigate to="/" replace />;
  }

  const data = COUNTRY_DATA[countrySlug.toLowerCase()];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-[#0B132B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">{data.flag}</span>
            <Badge className="bg-[#3BBA93] text-white hover:bg-[#3BBA93]/90 font-medium">
              AvadaPay Market Overview
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl">
            Payments & Communication in{' '}
            <span className="text-[#3BBA93]">{data.name}</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed">
            {data.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-xs sm:text-sm text-gray-300 font-medium">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
              <Building2 className="w-4 h-4 text-[#3BBA93]" />
              <span>Capital: {data.capital}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
              <Zap className="w-4 h-4 text-[#3BBA93]" />
              <span>Currency: {data.currency}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-[#3BBA93]" />
              <span>Regulator: {data.regulator}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Network Integrations */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Direct Telco & Banking Rails in {data.name}
          </h2>
          <p className="text-muted-foreground mt-2">
            Integrated payment infrastructure live with zero third-party intermediaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.telcos.map((telco) => (
            <Card key={telco.name} className="hover:border-[#3BBA93]/40 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base">{telco.name}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">{telco.type}</CardDescription>
                </div>
                <Badge variant="outline" className="border-[#3BBA93]/30 text-[#3BBA93] font-mono text-xs">
                  {telco.uptime} SLA
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-[#3BBA93]" />
                  <span>Sub-second settlement and instant webhook response</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Solutions in this country */}
      <section className="py-16 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Tailored for {data.name}'s Enterprise Demands
              </h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                Whether you are collecting retail customer mobile payments, processing international cards, or sending OTP notifications, our infrastructure delivers unmatched deliverability in {data.name}.
              </p>

              <div className="mt-8 space-y-4">
                {data.features.map((feat) => (
                  <div key={feat} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[#3BBA93] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground font-medium">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex space-x-4">
                <Link to="/contact">
                  <Button className="bg-[#3BBA93] hover:bg-[#32a481] text-white">
                    Start in {data.name}
                  </Button>
                </Link>
                <Link to="/payment-processing">
                  <Button variant="outline">
                    Explore API Specs
                  </Button>
                </Link>
              </div>
            </div>

            {/* In-country Office Contact Box */}
            <Card className="p-8 border-[#3BBA93]/20 shadow-md">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">{data.flag}</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">AvadaPay {data.name} Office</h3>
                  <p className="text-xs text-muted-foreground">Local support & account management</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Address</span>
                  <p className="text-foreground mt-1">{data.office}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Direct Inquiries</span>
                  <p className="text-foreground mt-1">{data.email}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Telephone</span>
                  <p className="text-foreground mt-1">{data.phone}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
