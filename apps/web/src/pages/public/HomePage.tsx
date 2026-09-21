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
    <div className="flex flex-col min-h-screen">
      {/* 
        Hero Section (Recreated from Adobe XD Design Screenshot)
      */}
      <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden pt-28 sm:pt-36 pb-0">
        {/* Ambient Card Payment Photography Background */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat transition-all duration-700 transform scale-105"
          style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        />
        {/* Dark High-Contrast Vignette Gradient Overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/55 to-[#0B132B]" />

        {/* Main Hero Typography Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-tight text-white leading-[1.15] max-w-5xl mx-auto">
            Payments and customer communication,{' '}
            <span className="text-[#3BBA93] block sm:inline">
              built for African markets.
            </span>
          </h1>

          {/* Key 3 Metrics Row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-14 text-white text-base sm:text-lg font-semibold tracking-wide">
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

        {/* Dark Sub-Banner Strip at the bottom of the hero */}
        <div className="w-full bg-[#0B132B]/90 backdrop-blur-md border-t border-white/10 py-6 sm:py-8 mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
              AvadaPay is a pan-African payment gateway and SMS aggregator. Accept mobile money and card payments, run POS, send bulk payouts, and reach customers by SMS, through one connected platform live in 17+ markets.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-[#3BBA93]/10 text-[#3BBA93] border-[#3BBA93]/30 hover:bg-[#3BBA93]/20 mb-3">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Built for High-Growth African Businesses
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              A unified technology stack to process revenue and communicate reliably with your customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Payment Processing Card */}
            <Card className="flex flex-col justify-between hover:border-[#3BBA93]/50 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-[#3BBA93]/10 text-[#3BBA93] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Payment Processing</CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed">
                  Accept payments via M-Pesa, MTN MoMo, Airtel Money, and cards. Automated STK push, online checkouts, and bulk disbursement transfers.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/payment-processing">
                  <Button variant="ghost" size="sm" className="space-x-1 p-0 text-[#3BBA93] hover:text-[#32a481]">
                    <span>Explore Payment Rails</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* POS Terminals Card */}
            <Card className="flex flex-col justify-between hover:border-[#3BBA93]/50 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Store className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Smart POS Terminals</CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed">
                  Android-based smart POS hardware for in-store checkout and agency banking. Accepts chip & PIN, contactless NFC, and mobile money QR codes.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/pos">
                  <Button variant="ghost" size="sm" className="space-x-1 p-0 text-[#3BBA93] hover:text-[#32a481]">
                    <span>Discover POS Solutions</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Bulk SMS Card */}
            <Card className="flex flex-col justify-between hover:border-[#3BBA93]/50 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Bulk SMS & OTPs</CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed">
                  Direct carrier connections across Africa ensuring &lt; 3-second OTP delivery, branded sender IDs, and transactional alert broadcasts.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/bulk-sms">
                  <Button variant="ghost" size="sm" className="space-x-1 p-0 text-[#3BBA93] hover:text-[#32a481]">
                    <span>View SMS Delivery Rails</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Country Markets Presence Showcase */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge className="bg-[#3BBA93]/10 text-[#3BBA93] border-[#3BBA93]/30 mb-2">
                Regional Hubs
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Dedicated Country Operations
              </h2>
              <p className="text-muted-foreground mt-2">
                Select your market to explore localized currencies, telco connections, and regulatory compliance.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-semibold text-muted-foreground">
              <Globe2 className="w-4 h-4 text-[#3BBA93]" />
              <span>Full East & Central African Coverage</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COUNTRIES.map((c) => (
              <Link key={c.code} to={c.path}>
                <Card className="hover:border-[#3BBA93] hover:shadow-lg transition-all h-full p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">{c.flag}</span>
                      <Badge variant="outline" className="text-xs font-medium text-[#3BBA93] border-[#3BBA93]/30">
                        Active Market
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">AvadaPay {c.name}</h3>
                    <p className="text-xs text-muted-foreground mt-2">
                      Click to view {c.name} telco integrations, local currency settlement, and in-country support office.
                    </p>
                  </div>
                  <div className="pt-6 flex items-center text-xs font-semibold text-[#3BBA93]">
                    <span>Explore {c.name} Gateway</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Content Feed from CMS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-2 border-[#3BBA93]/30 text-[#3BBA93]">
                AvadaPay Press & Announcements
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Latest Market Insights
              </h2>
              <p className="text-muted-foreground mt-2">
                Live articles and updates served directly via the AvadaPay PostgreSQL CMS backend.
              </p>
            </div>
            <Link to="/contact" className="mt-4 sm:mt-0">
              <Button variant="ghost" size="sm" className="space-x-1 text-[#3BBA93]">
                <span>Subscribe for Updates</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loadingNews ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-xl bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-xl bg-card">
              <p className="text-sm text-muted-foreground">No published content available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <Card key={item.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="capitalize text-[11px] text-[#3BBA93] bg-[#3BBA93]/10">
                        {item.category}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {item.excerpt || item.body}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Published by {item.author?.name || 'AvadaPay Editorial'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B132B] text-white relative overflow-hidden">
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
