import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Cpu,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { ContentItem } from '@avada/shared';

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
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-8 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Global Financial Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Financial Technology Engineered for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
              Unstoppable Growth
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Avada unifies global payouts, high-velocity settlement, and multi-currency operations into a single API platform built for modern scale.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" variant="gradient" className="space-x-2 shadow-lg shadow-blue-500/25">
                <span>Start Integration</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="space-x-2">
                <span>Explore Solutions</span>
              </Button>
            </Link>
          </div>

          {/* Key Metrics Counter Strip */}
          <div className="mt-16 pt-12 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm">
              <p className="text-3xl font-extrabold text-foreground">99.99%</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Platform Uptime SLA</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm">
              <p className="text-3xl font-extrabold text-foreground">140+</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Countries Supported</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm">
              <p className="text-3xl font-extrabold text-foreground">&lt; 250ms</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">API Execution Latency</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm">
              <p className="text-3xl font-extrabold text-foreground">$12B+</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Annual Volume Projected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-muted/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-3">
              Infrastructure
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Everything You Need to Power Global Commerce
            </h2>
            <p className="text-muted-foreground mt-4 text-base">
              A comprehensive suite of developer-first financial primitives configured to work together seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <CardTitle>Instant Global Payouts</CardTitle>
                <CardDescription>
                  Deliver funds directly to local bank accounts, digital wallets, and cards in real time across 140+ countries.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automated routing picks the cheapest and fastest local payment rails to ensure optimal delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <CardTitle>Automated Compliance & AML</CardTitle>
                <CardDescription>
                  Integrated biometric KYC, real-time sanctions screening, and AI-driven transaction risk assessment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stay fully compliant with regional financial authorities without adding friction to genuine users.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6" />
                </div>
                <CardTitle>Developer-First API</CardTitle>
                <CardDescription>
                  Idempotent REST endpoints, webhook subscriptions, and robust SDKs with sandbox verification environments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Go from onboarding to your first live test transaction in under thirty minutes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Content from CMS Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-2 border-primary/30 text-primary">
                From Our CMS Feed
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Latest Updates & Insights
              </h2>
              <p className="text-muted-foreground mt-2">
                Live articles and company announcements served directly via the Avada CMS engine.
              </p>
            </div>
            <Link to="/admin" className="mt-4 sm:mt-0">
              <Button variant="ghost" size="sm" className="space-x-1 text-primary">
                <span>Manage via CMS</span>
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
                      <Badge variant="secondary" className="capitalize text-[11px]">
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
                      By {item.author?.name || 'Avada Team'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Callout */}
      <section className="py-16 bg-gradient-to-tr from-blue-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Transform Your Payment Systems?
          </h2>
          <p className="mt-4 text-blue-200 max-w-xl mx-auto text-base">
            Join international businesses scaling their financial operations on the Avada platform.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-blue-950 hover:bg-blue-50 font-semibold shadow-xl">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
