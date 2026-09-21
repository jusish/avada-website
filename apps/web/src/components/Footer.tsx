import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, ShieldCheck, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">AVADA</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Global payment orchestration and modern enterprise fintech infrastructure. Fast, compliant, and scalable.
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SOC2 Type II & PCI-DSS Level 1 Compliant</span>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Global Payouts
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Multi-Currency Accounts
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Card Issuance
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Automated Reconciliation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Avada
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  CMS Administration
                </Link>
              </li>
              <li>
                <a href="#compliance" className="text-muted-foreground hover:text-primary transition-colors">
                  Regulatory Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Global */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 text-primary" />
              <span>support@avada.com</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4 text-primary" />
              <span>Operating in 140+ countries</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Avada Technologies Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#security" className="hover:text-foreground transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
