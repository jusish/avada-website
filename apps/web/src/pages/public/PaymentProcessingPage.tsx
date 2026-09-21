import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Smartphone,
  CreditCard,
  Building,
  RefreshCw,
  ArrowRight,
  Code2,
  CheckCircle2,
} from 'lucide-react';

export const PaymentProcessingPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-[#0B132B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="bg-[#3BBA93] text-white hover:bg-[#3BBA93]/90 font-medium mb-4">
            Payment Infrastructure
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Accept and Disburse Payments Across Africa with{' '}
            <span className="text-[#3BBA93]">One Unified API</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed">
            Eliminate fragmented payment integrations. Connect directly to Africa’s most popular mobile money wallets, card switches, and banking rails through AvadaPay.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contact">
              <Button size="lg" className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-semibold shadow-lg shadow-[#3BBA93]/20">
                Get API Keys
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Rails Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Complete Payment Rails Coverage
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            Engineered for high-throughput merchants, microfinance institutions, and e-commerce platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:border-[#3BBA93]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-[#3BBA93]/10 text-[#3BBA93] flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">Mobile Money</CardTitle>
              <CardDescription className="text-xs">
                M-Pesa, MTN MoMo, Airtel Money, Tigo Pesa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Prompt seamless USSD or STK push transactions on customer phones with instant status webhooks.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-[#3BBA93]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">Card Acquiring</CardTitle>
              <CardDescription className="text-xs">
                Visa, Mastercard, Verve & UnionPay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Accept 3D Secure domestic and international cards with automated tokenization and recurring billing.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-[#3BBA93]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <Building className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">Bank Transfers</CardTitle>
              <CardDescription className="text-xs">
                PesaLink, EFT, RTGS & TIPSS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Provide unique virtual account numbers for instant bank-to-bank settlement without manual reconciliation.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-[#3BBA93]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">Bulk Payouts</CardTitle>
              <CardDescription className="text-xs">
                High-Volume Disbursements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Disburse salaries, supplier payments, and loans to thousands of phone numbers and bank accounts in minutes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Developer API Preview */}
      <section className="py-20 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#3BBA93] uppercase tracking-wider mb-3">
                <Code2 className="w-4 h-4" />
                <span>Developer-Friendly</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Integration So Fast You Can Ship in Hours
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Our RESTful API provides standardized payloads, predictable error codes, idempotent requests, and sandboxes that simulate all telco failure and success states.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#3BBA93]" />
                  <span>SDKs for Node.js, Python, PHP, and Go</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#3BBA93]" />
                  <span>Real-time HMAC signature verified webhooks</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#3BBA93]" />
                  <span>Sandbox environment with simulated telco timeouts</span>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/contact">
                  <Button className="bg-[#3BBA93] hover:bg-[#32a481] text-white space-x-2">
                    <span>Read API Documentation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Code snippet block */}
            <div className="bg-[#0B132B] rounded-xl p-6 text-gray-200 font-mono text-xs shadow-2xl border border-white/10 overflow-x-auto">
              <div className="flex items-center space-x-2 pb-4 border-b border-white/10 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-gray-400 text-[11px] ml-2 font-sans">POST /v1/payments/charge</span>
              </div>
              <pre className="leading-relaxed">
{`curl -X POST https://api.avadapay.com/v1/payments/charge \\
  -H "Authorization: Bearer sec_live_9a7bc81..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2500,
    "currency": "KES",
    "provider": "mpesa",
    "phone": "+254712345678",
    "reference": "ORDER-9921",
    "callback_url": "https://yourapp.com/webhooks/avada"
  }'`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
