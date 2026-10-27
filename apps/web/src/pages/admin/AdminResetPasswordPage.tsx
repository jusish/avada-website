import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAdminTitle } from '@/lib/useAdminTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Lock, AlertCircle, Loader2, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const AdminResetPasswordPage: React.FC = () => {
  useAdminTitle('Set New Password');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Missing or invalid reset token. Please request a new password reset link.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to reset password. The link may have expired.');
      }

      setIsSuccess(true);
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
              Security
            </span>
          </div>
          <p className="text-xs text-white/60">Choose a new secure password for your account</p>
        </div>

        <Card className="shadow-2xl border-white/10 bg-[#1E1D21] text-white">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3BBA93]" />
              <span>Create New Password</span>
            </CardTitle>
            <CardDescription className="text-xs text-white/60">
              Ensure your new password contains at least 8 characters with numbers and symbols.
            </CardDescription>
          </CardHeader>

          {isSuccess ? (
            <CardContent className="pt-6 pb-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#3BBA93]/20 text-[#3BBA93] border border-[#3BBA93]/40 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-white">Password Updated!</h3>
                <p className="text-xs text-white/70 leading-relaxed max-w-xs mx-auto">
                  Your administrator credentials have been securely updated. You can now sign in with your new password.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  onClick={() => navigate('/admin/login', { replace: true })}
                  className="w-full bg-[#3BBA93] hover:bg-[#32a481] text-white font-bold h-10 shadow-lg shadow-[#3BBA93]/20 transition-all active:scale-[0.98]"
                >
                  Proceed to Administrator Sign In
                </Button>
              </div>
            </CardContent>
          ) : !token ? (
            <CardContent className="pt-6 pb-6 text-center space-y-4">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>No password reset token was provided in the URL. Please request a new link.</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin/forgot-password"
                  className="inline-flex items-center justify-center text-xs text-[#3BBA93] hover:underline font-semibold"
                >
                  Request Password Reset Link
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-5">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="new-password" className="text-xs text-white/80">New Password *</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                    <Input
                      id="new-password"
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

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-xs text-white/80">Confirm New Password *</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your new password"
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
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Save New Password & Activate</span>
                    </>
                  )}
                </Button>

                <Link
                  to="/admin/login"
                  className="text-xs text-center text-white/60 hover:text-white transition-colors"
                >
                  Cancel and Return to Sign In
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
