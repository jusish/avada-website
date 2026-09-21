import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  RefreshCw,
  Landmark,
  ShieldCheck,
  Zap,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'Global Payout Orchestration',
      description:
        'Deliver funds directly into local accounts across 140+ countries. Intelligent routing chooses the optimal rails for minimum fee and instant delivery.',
      icon: Zap,
    },
    {
      title: 'Multi-Currency Virtual Accounts',
      description:
        'Issue local virtual IBANs and account numbers in EUR, USD, GBP, JPY, and more. Accept payments from domestic clients without cross-border surcharges.',
      icon: Landmark,
    },
    {
      title: 'Corporate Card Issuance',
      description:
        'Issue physical and virtual Visa and Mastercard debit cards with customizable spending limits, merchant restrictions, and instant webhook authorizations.',
      icon: CreditCard,
    },
    {
      title: 'Real-Time FX & Hedging',
      description:
        'Access interbank foreign exchange rates with transparent margin models and algorithmic forward contracts to hedge against volatile currency swings.',
      icon: RefreshCw,
    },
    {
      title: 'Automated Regulatory Reporting',
      description:
        'Automate your compliance burdens with built-in audit trails, automated tax ledger generation, and exportable FinCEN / GDPR reporting packages.',
      icon: ShieldCheck,
    },
    {
      title: 'Financial Intelligence & Analytics',
      description:
        'Live cashflow forecasting, automated ledger reconciliation, and custom webhook callbacks streaming directly to your ERP or accounting software.',
      icon: BarChart3,
    },
  ];

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-3 text-primary border-primary/30">
          Our Solutions
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Financial Products Built for Enterprise Scale
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Modular, robust APIs designed to handle complex money movements, FX hedging, and enterprise card programs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.title} className="flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/contact">
                  <Button variant="ghost" size="sm" className="space-x-1 p-0 text-primary hover:text-primary/80">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
