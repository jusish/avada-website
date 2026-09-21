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
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-3 text-primary border-primary/30">
          Get In Touch
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Let’s Discuss Your Financial Infrastructure
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Our global payments engineering team is ready to assist you in designing a customized deployment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-6">
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-primary flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Email Us</CardTitle>
                <CardDescription>enterprise@avada.com</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="p-2">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Direct Line</CardTitle>
                <CardDescription>+1 (800) 555-AVADA</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="p-2">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Headquarters</CardTitle>
                <CardDescription>Global Financial District, Suite 400</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-6">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-bold text-foreground">Message Received</h3>
                <p className="text-muted-foreground max-w-md mx-auto text-sm">
                  Thank you for reaching out. An Avada enterprise solutions specialist will contact you within 24 hours.
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
                    <Input id="firstName" placeholder="Jane" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input id="email" type="email" placeholder="jane@company.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Acme Corp" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">How can we assist your business?</Label>
                  <textarea
                    id="message"
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us about your estimated monthly payout volume or infrastructure needs..."
                    required
                  />
                </div>

                <Button type="submit" variant="gradient" size="lg" className="w-full">
                  Submit Inquiry
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
