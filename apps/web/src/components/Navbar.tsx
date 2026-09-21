import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Sparkles, ArrowRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70">
              AVADA
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-primary -mt-1">
              FINTECH
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/admin">
            <Button variant="outline" size="sm" className="space-x-1.5 border-border hover:border-primary/50">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>CMS Portal</span>
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="gradient" size="sm" className="space-x-1">
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-border flex flex-col space-y-2">
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                CMS Portal
              </Button>
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="gradient" className="w-full justify-center">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
