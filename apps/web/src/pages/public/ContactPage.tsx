import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-[#3BBA93]/10 text-[#3BBA93] border-[#3BBA93]/30 mb-3">
            Contact AvadaPay
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Let’s Power Your African Operations
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Our payments engineering and merchant onboarding teams across Nairobi, Kigali, and Dar es Salaam are ready to support your integration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details */}
          <div className="space-y-6">
            <Card className="p-2 border-border/80">
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-[#3BBA93]/10 text-[#3BBA93] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Direct Inquiries</CardTitle>
                  <CardDescription>support@avadapay.com</CardDescription>
                </div>
              </CardHeader>
            </Card>

            <Card className="p-2 border-border/80">
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Support Hotline</CardTitle>
                  <CardDescription>+254 20 790 3000</CardDescription>
                </div>
              </CardHeader>
            </Card>

            <Card className="p-4 border-border/80">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 text-[#3BBA93]" />
                <span>Regional Offices</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-foreground">🇰🇪 Nairobi Hub:</span>
                  <p className="text-muted-foreground">Westlands, Nairobi, Kenya</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">🇷🇼 Kigali Hub:</span>
                  <p className="text-muted-foreground">Kigali Innovation City, Kigali, Rwanda</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground">🇹🇿 Dar es Salaam Hub:</span>
                  <p className="text-muted-foreground">Peninsula Commercial Hub, Masaki, Tanzania</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8 border-border/80 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#3BBA93] mx-auto" />
                  <h3 className="text-2xl font-bold text-foreground">Inquiry Received</h3>
                  <p className="text-muted-foreground max-w-md mx-auto text-sm">
                    Thank you for reaching out to AvadaPay. An integration specialist will follow up with you within 24 business hours.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Alex" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Mwangi" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input id="email" type="email" placeholder="alex@company.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" placeholder="Fintech Solutions Ltd" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="market">Primary Target Market</Label>
                    <Input id="market" placeholder="e.g. Kenya, Rwanda, Tanzania, or Pan-African" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Estimated Monthly Volume & Services Needed</Label>
                    <textarea
                      id="message"
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="e.g. Seeking M-Pesa & MTN Mobile Money collections plus 50 POS terminals in Kigali..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#3BBA93] hover:bg-[#32a481] text-white font-semibold shadow-md shadow-[#3BBA93]/20"
                  >
                    Submit Enterprise Request
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
