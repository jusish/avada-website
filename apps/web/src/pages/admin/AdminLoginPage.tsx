import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAndClearSessionNotice } from '@/lib/auth-interceptor';
import { useAdminTitle } from '@/lib/useAdminTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles, Shield, Lock, Mail, AlertCircle, Loader2, Clock, Eye, EyeOff } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  useAdminTitle('Administrator Sign In');
  const { token, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // In development, provide prefilled demo credentials for convenience.
  // In production, strictly leave blank and hide any helper credentials box.
  const isDev = import.meta.env.DEV;
  const [email, setEmail] = useState(isDev ? 'admin@avada.com' : '');
  const [password, setPassword] = useState(isDev ? 'admin123' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionNotice, setSessionNotice] = useState<string | null>(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) return state.message;
    return getAndClearSessionNotice();
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect straight to dashboard
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A292D]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3BBA93]"></div>
      </div>
    );
  }

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSessionNotice(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please check credentials.');
      }

      login(data.data.token, data.data.user);

      // Restore user to intended page or dashboard
      const state = location.state as { from?: { pathname?: string; search?: string } } | null;
      const redirectPath = state?.from
        ? `${state.from.pathname || '/admin/dashboard'}${state.from.search || ''}`
        : '/admin/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#2A292D] text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 group" title="Return to AvadaPay Website">
            <img
              src="/logo.svg"
              alt="AvadaPay"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <h2 className="text-xl font-extrabold tracking-tight text-white">CMS Administration</h2>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-[#3BBA93]/20 text-[#3BBA93] border border-[#3BBA93]/30">
              Portal
            </span>
          </div>
          <p className="text-xs text-white/60">Sign in with authorized administrator credentials</p>
        </div>

        <Card className="shadow-2xl border-white/10 bg-[#1E1D21] text-white">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-base font-bold text-white">Administrator Sign In</CardTitle>
            <CardDescription className="text-xs text-white/60">
              Manage website content, press releases, and infrastructure announcements.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-5">
              {/* Session Expiry or Logged Out Banner */}
              {sessionNotice && (
                <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-2.5 shadow-sm">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-amber-300">Session Notice</p>
                    <p className="text-amber-200/90 leading-relaxed">{sessionNotice}</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-xs text-white/80">Admin Email</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="name@avada.com"
                    className="pl-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="text-xs text-white/80">Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-9 pr-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-white/40 hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Dev credentials shown strictly in development environment */}
              {isDev && (
                <div className="p-3 rounded-lg bg-[#3BBA93]/10 border border-[#3BBA93]/20 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-[#3BBA93] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Local Development Credentials:</span>
                  </div>
                  <p className="text-white/70">Email: <code className="text-[#3BBA93] font-mono">admin@avada.com</code></p>
                  <p className="text-white/70">Password: <code className="text-[#3BBA93] font-mono">admin123</code></p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full justify-center space-x-2 bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold h-10 shadow-lg shadow-[#3BBA93]/20 transition-all active:scale-[0.98]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Authorize & Access CMS</span>
                  </>
                )}
              </Button>

              <Link
                to="/"
                className="text-xs text-center text-white/60 hover:text-white transition-colors"
              >
                ← Return to Public Website
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
