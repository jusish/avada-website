import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Target, HeartHandshake, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-3 text-primary border-primary/30">
          Our Company
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Empowering the Future of Global Value Exchange
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Founded to dismantle the barriers of legacy banking rails, Avada gives modern companies an uncompromising financial architecture built for global scale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
        <Card className="p-4">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-primary flex items-center justify-center mb-2">
              <Target className="w-5 h-5" />
            </div>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              To make financial operations as rapid, programmable, and frictionless as sending data packets over the internet.
            </p>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <CardTitle>Institutional Trust</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We operate under rigorous global compliance regimes, bank partnerships, and bank-grade data security protocols.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl bg-card border border-border p-8 sm:p-12 text-center shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Global Presence, Local Intelligence
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          With offices in major financial hubs and localized banking endpoints across EMEA, APAC, and the Americas, Avada bridges the gap between international vision and local market compliance.
        </p>
        <div className="inline-flex items-center space-x-6 text-sm font-semibold text-foreground">
          <span className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-primary" />
            <span>Fintech Innovation Award 2025</span>
          </span>
          <span className="flex items-center space-x-2">
            <HeartHandshake className="w-4 h-4 text-emerald-500" />
            <span>Tier-1 Banking Partners</span>
          </span>
        </div>
      </div>
    </div>
  );
};
