import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Store,
  Wifi,
  Receipt,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const PosPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-[#0B132B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="bg-[#3BBA93] text-white hover:bg-[#3BBA93]/90 font-medium mb-4">
            In-Store Hardware & Terminals
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
            Next-Generation Smart POS for{' '}
            <span className="text-[#3BBA93]">Retail & Agent Networks</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed">
            Equip your retail stores, supermarkets, and agency banking network with Android-powered POS terminals capable of processing chip & PIN, contactless cards, QR codes, and mobile money.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contact">
              <Button size="lg" className="bg-[#3BBA93] hover:bg-[#32a481] text-white font-semibold shadow-lg shadow-[#3BBA93]/20">
                Order POS Terminals
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Request Fleet Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* POS Capabilities */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Engineered for African Retail Environments
          </h2>
          <p className="text-muted-foreground mt-3 text-base">
            Hardware and firmware optimized for erratic connectivity, long battery cycles, and high volume daily footfall.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:border-[#3BBA93]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-[#3BBA93]/10 text-[#3BBA93] flex items-center justify-center mb-4">
                <Store className="w-6 h-6" />
              </div>
              <CardTitle>All-in-One Acceptance</CardTitle>
              <CardDescription>
                Card, Mobile Money & QR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Accept Visa, Mastercard, and UnionPay alongside dynamic QR codes for M-Pesa, Airtel Money, and MTN MoMo directly from the customer screen.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-[#3BBA93]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6" />
              </div>
              <CardTitle>Dual-SIM & Offline Fallback</CardTitle>
              <CardDescription>
                Zero Downtime at Checkout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Equipped with 4G dual-SIM auto-switching and Wi-Fi failover. Transactions queue safely if networks drop and synchronize immediately upon restoration.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-[#3BBA93]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6" />
              </div>
              <CardTitle>High-Speed Thermal Printing</CardTitle>
              <CardDescription>
                Paper & Digital Receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fast built-in thermal printer prints customer receipts in under 1.5 seconds. Optionally send SMS e-receipts to the customer’s mobile number.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Terminal Fleet Management */}
      <section className="py-16 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Centralized Fleet Management (TMS)
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Manage 10 or 10,000 terminals across multiple cities from your web dashboard. Push over-the-air firmware updates, monitor live battery status, and track cashflow per store branch.
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#3BBA93]" />
                  <span>Remote Over-the-Air (OTA) application updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#3BBA93]" />
                  <span>Geofencing and automatic fraud alert locks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#3BBA93]" />
                  <span>Daily automated bank settlement to your business account</span>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/contact">
                  <Button className="bg-[#3BBA93] hover:bg-[#32a481] text-white space-x-2">
                    <span>Inquire About POS Deployment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div>
                  <h3 className="font-bold text-base text-foreground">AvadaPay Smart V300 Terminal</h3>
                  <p className="text-xs text-muted-foreground">Certified PCI-PTS 6.x & EMV Level 1 & 2</p>
                </div>
                <Badge variant="success">In Stock</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase font-semibold">OS</span>
                  <p className="font-semibold text-foreground">Secure Android 12</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase font-semibold">Battery</span>
                  <p className="font-semibold text-foreground">5200mAh (72h Standby)</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase font-semibold">Display</span>
                  <p className="font-semibold text-foreground">5.5" HD Touchscreen</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase font-semibold">Connectivity</span>
                  <p className="font-semibold text-foreground">4G / 3G / 2G + Wi-Fi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
