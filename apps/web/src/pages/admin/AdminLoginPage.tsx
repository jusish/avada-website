import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles, Shield, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@avada.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">AVADA</span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-foreground">CMS Administration</h2>
          <p className="text-xs text-muted-foreground">Sign in with authorized administrator credentials</p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-lg">Administrator Sign In</CardTitle>
            <CardDescription className="text-xs">
              Manage website content, press releases, and infrastructure announcements.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-xs">Admin Email</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <Input
                    id="admin-email"
                    type="email"
                    className="pl-9 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-xs">Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <Input
                    id="admin-password"
                    type="password"
                    className="pl-9 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Initial Seed Account:</p>
                <p>Email: <code className="text-primary font-mono">admin@avada.com</code></p>
                <p>Password: <code className="text-primary font-mono">admin123</code></p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                type="submit"
                variant="gradient"
                className="w-full justify-center space-x-2"
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
                className="text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
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
