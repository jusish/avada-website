import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Smartphone,
  Store,
  MessageSquare,
  ArrowRight,
  Globe2,
  ChevronRight,
  Send,
  CreditCard,
} from 'lucide-react';
import { ContentItem } from '@avada/shared';
import { COUNTRIES } from '@/components/Navbar';

export const HomePage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<ContentItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setNewsItems(data.data.slice(0, 3));
        }
      })
      .catch((err) => {
        console.error('Failed to load news items:', err);
      })
      .finally(() => setLoadingNews(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* 
        Hero Section (Pixel-Close to Adobe XD Screenshot)
      */}
      <section className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden pt-20 sm:pt-28 pb-0">
        {/* Ambient Card Payment Photography Background */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        />
        {/* Dark High-Contrast Overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/60 to-black/85" />

        {/* Main Hero Typography */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.12] max-w-5xl mx-auto">
            Payments and customer communication,{' '}
            <span className="text-[#3BBA93] block sm:inline">
              built for African markets.
            </span>
          </h1>

          {/* 3 Key Metrics */}
          <div className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-white text-base sm:text-lg font-semibold tracking-wide">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#3BBA93]" />
              <span>99.9% uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#3BBA93]" />
              <span>17+ African markets</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#3BBA93]" />
              <span>Mobile money + card + POS</span>
            </div>
          </div>
        </div>

        {/* Sub-Banner Strip: Black with 23% opacity as specified in design */}
        <div className="w-full bg-black/[0.23] backdrop-blur-sm border-t border-white/10 py-5 sm:py-6 mt-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs sm:text-sm md:text-base text-gray-200 font-normal leading-relaxed">
              AvadaPay is a pan-African payment gateway and SMS aggregator. Accept mobile money and card payments, run POS, send bulk payouts, and reach customers by SMS, through one connected platform live in 17+ markets.
            </p>
          </div>
        </div>
      </section>

      {/* Ticker / Hook Section from Screenshot */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Header Graphic */}
          <div className="flex items-center justify-center space-x-3 text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            <span>platform.</span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#3BBA93]/10 flex items-center justify-center text-[#3BBA93]">
              <Send className="w-6 h-6 sm:w-7 sm:h-7 -rotate-12 fill-current" />
            </div>
            <span className="text-[#3BBA93]">Payments and SMS</span>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            <p>
              African businesses don't operate in a single payment world. Customers pay through M-Pesa in Nairobi, Orange Money in Kinshasa, Tigo Pesa in Dar es Salaam, and cards almost everywhere. AvadaPay connects you to all of it through one integration.
            </p>
            <p>
              Collect payments, send payouts to agents and customers, accept in-person payments through POS, and communicate every transaction through SMS, without stitching together five different providers per country.
            </p>
          </div>
        </div>
      </section>

      {/* Green Section: "Four ways AvadaPay powers your business" */}
      <section className="py-20 bg-[#3BBA93] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Four ways AvadaPay powers your business
            </h2>
            <p className="text-white/80 mt-3 text-base font-medium">
              Everything required to orchestrate money and communication across Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Online & Mobile Money */}
            <div className="bg-white rounded-2xl p-6 text-gray-900 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#3BBA93]/10 text-[#3BBA93] flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Accept Online Payments</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Single checkout for M-Pesa, MTN MoMo, Airtel Money, and cards with instant webhook confirmations.
                </p>
              </div>
              <Link to="/payment-processing" className="mt-6">
                <span className="text-xs font-bold text-[#3BBA93] flex items-center hover:underline">
                  Payment Processing <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </Link>
            </div>

            {/* 2. Smart POS */}
            <div className="bg-white rounded-2xl p-6 text-gray-900 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Smart POS Terminals</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Android POS hardware for in-store retail, supermarket checkouts, and agency banking cash collections.
                </p>
              </div>
              <Link to="/pos" className="mt-6">
                <span className="text-xs font-bold text-[#3BBA93] flex items-center hover:underline">
                  Explore POS Hardware <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </Link>
            </div>

            {/* 3. Bulk Payouts */}
            <div className="bg-white rounded-2xl p-6 text-gray-900 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Bulk Wallet Payouts</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Disburse supplier payments, commissions, and payroll directly into mobile wallets in seconds.
                </p>
              </div>
              <Link to="/payment-processing" className="mt-6">
                <span className="text-xs font-bold text-[#3BBA93] flex items-center hover:underline">
                  Disbursement API <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </Link>
            </div>

            {/* 4. Bulk SMS */}
            <div className="bg-white rounded-2xl p-6 text-gray-900 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Bulk SMS & OTPs</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Sub-3-second OTP verification and marketing SMS broadcasts across all regional mobile telcos.
                </p>
              </div>
              <Link to="/bulk-sms" className="mt-6">
                <span className="text-xs font-bold text-[#3BBA93] flex items-center hover:underline">
                  SMS Gateway <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Country Presence Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge className="bg-[#3BBA93]/10 text-[#3BBA93] border-[#3BBA93]/30 mb-2 font-medium">
                Live Regional Operations
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Explore Dedicated Country Hubs
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Each country represents localized currency settlement, telco contracts, and central bank compliance.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-semibold text-gray-500">
              <Globe2 className="w-4 h-4 text-[#3BBA93]" />
              <span>Full East & Central African Infrastructure</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COUNTRIES.map((c) => (
              <Link key={c.code} to={c.path}>
                <Card className="hover:border-[#3BBA93] hover:shadow-lg transition-all h-full p-6 flex flex-col justify-between bg-white border-gray-200">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">{c.flag}</span>
                      <Badge variant="outline" className="text-[11px] font-medium text-[#3BBA93] border-[#3BBA93]/30">
                        Direct Telco Rails
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">AvadaPay {c.name}</h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Tap to view {c.name} mobile money integrations, local bank clearing, and in-country support office.
                    </p>
                  </div>
                  <div className="pt-6 flex items-center text-xs font-bold text-[#3BBA93]">
                    <span>View {c.name} Hub</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live CMS Articles Feed */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-2 border-[#3BBA93]/30 text-[#3BBA93]">
                AvadaPay Insights
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Latest Announcements & Features
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Real-time articles published through the AvadaPay PostgreSQL CMS backend.
              </p>
            </div>
            <Link to="/contact" className="mt-4 sm:mt-0">
              <Button variant="ghost" size="sm" className="space-x-1 text-[#3BBA93]">
                <span>Contact Integration Team</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loadingNews ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-xl bg-gray-50">
              <p className="text-sm text-gray-500">No published articles yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <Card key={item.id} className="flex flex-col justify-between hover:shadow-md transition-shadow border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="capitalize text-[11px] text-[#3BBA93] bg-[#3BBA93]/10">
                        {item.category}
                      </Badge>
                      <span className="text-[11px] text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-gray-900 leading-snug">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2 text-xs text-gray-600">
                      {item.excerpt || item.body}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-[11px] text-gray-400">
                      Author: {item.author?.name || 'AvadaPay Editorial'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 bg-[#2A292D] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Scale Your Pan-African Payments Today
          </h2>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto text-base">
            Integrate in minutes, accept multi-carrier mobile money, deploy POS terminals, and reach customers seamlessly.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/contact">
              <Button size="lg" className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-semibold shadow-xl shadow-[#3BBA93]/20">
                Contact Our Payments Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
