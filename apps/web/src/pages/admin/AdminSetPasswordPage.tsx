import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAdminTitle } from '@/lib/useAdminTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Lock, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck, CheckCircle2, Key } from 'lucide-react';

export const AdminSetPasswordPage: React.FC = () => {
  useAdminTitle('First-Time Password Setup');
  const { user, token, login } = useAuth();
  const navigate = useNavigate();

  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Independent eye toggles for each password field
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If unauthenticated or user doesn't require setting password, bounce to login
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user.mustChangePassword) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!temporaryPassword.trim()) {
      setError('Please provide the temporary password sent to your email.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Your new password must be at least 8 characters long.');
      return;
    }

    if (newPassword === temporaryPassword) {
      setError('Your new password must be different from your temporary password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure your new password and confirmation match exactly.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          temporaryPassword: temporaryPassword.trim(),
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update your password. Please verify your temporary password.');
      }

      // Update auth context with clean active user state
      if (token && data.data?.user) {
        login(token, data.data.user);
      }

      // Redirect immediately to dashboard
      navigate('/admin/dashboard', { replace: true });
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
          <img
            src="/logo.svg"
            alt="AvadaPay"
            className="h-8 sm:h-9 w-auto object-contain mx-auto"
          />
          <div className="flex items-center justify-center space-x-2 mt-2">
            <h2 className="text-xl font-extrabold tracking-tight text-white">Welcome, {user?.name || 'Team Member'}!</h2>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-[#3BBA93]/20 text-[#3BBA93] border border-[#3BBA93]/30">
              Account Activation
            </span>
          </div>
          <p className="text-xs text-white/60">
            For security, please verify your temporary credentials and choose a permanent password
          </p>
        </div>

        <Card className="shadow-2xl border-white/10 bg-[#1E1D21] text-white">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3BBA93]" />
              <span>Mandatory Security Setup</span>
            </CardTitle>
            <CardDescription className="text-xs text-white/60">
              Enter your temporary password from the invitation email, then choose a secure personal password.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#3BBA93]/10 border border-[#3BBA93]/20 text-xs text-[#3BBA93] flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-relaxed text-white/80">
                  <span className="font-semibold text-[#3BBA93]">Security Verification:</span>
                  <p className="text-[11px] text-white/60">
                    Proving knowledge of your temporary password ensures only the authorized email recipient can activate this account.
                  </p>
                </div>
              </div>

              {/* Temporary Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="set-temp-password" className="text-xs text-white/80">
                  Temporary Password *
                </Label>
                <div className="relative">
                  <Key className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <Input
                    id="set-temp-password"
                    type={showTempPassword ? 'text' : 'password'}
                    placeholder="Enter password from invitation email"
                    className="pl-9 pr-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                    value={temporaryPassword}
                    onChange={(e) => setTemporaryPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowTempPassword(!showTempPassword)}
                    className="absolute right-3 top-2.5 text-white/40 hover:text-white transition-colors"
                    aria-label={showTempPassword ? 'Hide password' : 'Show password'}
                  >
                    {showTempPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="set-new-password" className="text-xs text-white/80">
                  New Permanent Password *
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <Input
                    id="set-new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    className="pl-9 pr-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-white/40 hover:text-white transition-colors"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field with Independent Eye Toggle */}
              <div className="space-y-1.5">
                <Label htmlFor="set-confirm-password" className="text-xs text-white/80">
                  Confirm Permanent Password *
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <Input
                    id="set-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your permanent password"
                    className="pl-9 pr-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BBA93] focus-visible:border-[#3BBA93]"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-white/40 hover:text-white transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
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
                    <span>Activating account...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Save Permanent Password & Enter CMS</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
