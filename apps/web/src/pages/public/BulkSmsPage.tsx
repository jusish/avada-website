import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Globe2,
  CheckCircle2,
  ArrowRight,
  Clock,
  Radio,
} from 'lucide-react';

export const BulkSmsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-[#0B132B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="bg-[#3BBA93] text-white hover:bg-[#3BBA93]/90 font-medium mb-4">
            Telecommunication & SMS Aggregation
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Enterprise Bulk SMS & OTPs Across{' '}
            <span className="text-[#3BBA93]">17+ African Markets</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed">
            Direct SS7 & SMPP telco connections ensuring &lt; 3-second OTP delivery, branded alphanumeric sender IDs, and real-time delivery receipts across the continent.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contact">
              <Button size="lg" className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-semibold shadow-lg shadow-[#3BBA93]/20">
                Register Sender ID
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View SMS Rates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SMS Solutions Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Critical Communication Channels for Fast-Moving Businesses
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            Optimized for banks, fintechs, delivery fleets, and enterprise customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:border-[#3BBA93]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-[#3BBA93]/10 text-[#3BBA93] flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <CardTitle>Ultra-Fast OTPs & 2FA</CardTitle>
              <CardDescription>
                Sub-3-Second Global Delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prioritized routing queues guarantee lightning-fast verification codes for signups, password resets, and transaction confirmations.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-[#3BBA93]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <Radio className="w-6 h-6" />
              </div>
              <CardTitle>Custom Alphanumeric Sender IDs</CardTitle>
              <CardDescription>
                Brand Trust on Every Message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Send messages displaying your exact company name (e.g. "AVADAPAY") rather than random numerical phone numbers.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-[#3BBA93]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <CardTitle>Multi-Network Smart Routing</CardTitle>
              <CardDescription>
                Automatic Telco Failover
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If a telco base station suffers congestion, our algorithmic gateway re-routes your packets via alternate carrier links instantly.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Integration Banner */}
      <section className="py-16 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                High-Volume Campaign Broadcasts & Webhooks
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Broadcast customer updates, product drops, or payment reminders to hundreds of thousands of recipients simultaneously with comprehensive delivery tracking.
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#3BBA93]" />
                  <span>Real-time DLR (Delivery Receipts) via webhooks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#3BBA93]" />
                  <span>Opt-out management and regional regulatory compliance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#3BBA93]" />
                  <span>Unicode and emoji support for multi-language text</span>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/contact">
                  <Button className="bg-[#3BBA93] hover:bg-[#32a481] text-white space-x-2">
                    <span>Contact Our SMS Specialists</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-[#0B132B] rounded-xl p-6 text-gray-200 font-mono text-xs shadow-2xl border border-white/10 overflow-x-auto">
              <div className="flex items-center space-x-2 pb-4 border-b border-white/10 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-gray-400 text-[11px] ml-2 font-sans">POST /v1/sms/send</span>
              </div>
              <pre className="leading-relaxed">
{`curl -X POST https://api.avadapay.com/v1/sms/send \\
  -H "Authorization: Bearer sec_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "sender_id": "AvadaPay",
    "recipients": ["+254712345678", "+250788123456"],
    "message": "Your verification code is 849201. Valid for 5 minutes.",
    "type": "otp"
  }'`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
