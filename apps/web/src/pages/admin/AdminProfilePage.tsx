import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAdminTitle } from '@/lib/useAdminTitle';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  User as UserIcon,
  ShieldCheck,
  KeyRound,
  Globe2,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Calendar,
  Mail,
  Shield,
} from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  useAdminTitle('My Profile & Security');
  const { user, token, isSuperAdmin, login } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(!!user?.twoFactorEnabled);
  const [isToggling2FA, setIsToggling2FA] = useState(false);
  const [twoFactorMessage, setTwoFactorMessage] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPassword.length < 8) {
      setPassError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New password and confirmation do not match.');
      return;
    }

    setIsChangingPass(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setPassSuccess('Your password has been successfully changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleToggle2FA = async () => {
    setTwoFactorMessage(null);
    setIsToggling2FA(true);

    try {
      const response = await fetch('/api/auth/2fa/toggle', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update 2FA configuration.');
      }

      setTwoFactorEnabled(data.twoFactorEnabled);
      setTwoFactorMessage(data.message || 'Two-factor authentication updated.');

      // Update user in context
      if (user && token) {
        login(token, {
          ...user,
          twoFactorEnabled: data.twoFactorEnabled,
        });
      }
    } catch (err) {
      setPassError(err instanceof Error ? err.message : 'Failed to toggle 2FA.');
    } finally {
      setIsToggling2FA(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2A292D] flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-[#3BBA93]" />
          <span>My Profile & Account Security</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your personal administrator identity, regional market scope, and authentication credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-[#3BBA93] text-[#3BBA93]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-[#3BBA93] text-[#3BBA93]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Credentials</span>
        </button>
      </div>

      {/* Tab 1: Profile Details */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity Card */}
          <Card className="md:col-span-1 bg-white border-gray-200/80 shadow-sm rounded-xl overflow-hidden">
            <div className="bg-[#2A292D] p-6 text-center text-white">
              <div className="w-20 h-20 rounded-full bg-[#3BBA93]/20 text-[#3BBA93] border-2 border-[#3BBA93] mx-auto flex items-center justify-center font-extrabold text-2xl shadow-inner mb-3">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-8 h-8" />}
              </div>
              <h2 className="text-base font-bold text-white">{user?.name || 'Administrator'}</h2>
              <p className="text-xs text-[#3BBA93] font-semibold mt-0.5">
                {user?.role?.name || (isSuperAdmin ? 'Global Super Administrator' : 'Staff Member')}
              </p>
              <div className="mt-3">
                <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-400/30 text-[10px] font-bold">
                  {user?.status === 'ACTIVE' ? 'Active Account' : user?.status || 'Active'}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
                  Corporate Email
                </span>
                <div className="flex items-center gap-2 mt-1 text-[#2A292D] font-semibold">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{user?.email}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
                  Account Identifier
                </span>
                <span className="font-mono text-[11px] text-gray-600 break-all block mt-1">
                  {user?.id}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
                  Member Since
                </span>
                <div className="flex items-center gap-2 mt-1 text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Markets & Permissions Card */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#3BBA93]" />
                  <span>Regional Market Hubs Scope</span>
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Countries and regional operations routed to your administrative profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                {isSuperAdmin ? (
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-200/70 text-purple-900 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-purple-800">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span>Global Regional Authority (Super Admin)</span>
                    </div>
                    <p className="text-purple-700/90 leading-relaxed text-[11px]">
                      Your account possesses unrestricted governance across all active African markets, including inquiries, settings, content, and team administration.
                    </p>
                  </div>
                ) : user?.countries && user.countries.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-600">
                      You are assigned to the following regional market hubs:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {user.countries.map((c) => (
                        <div
                          key={c.id}
                          className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center uppercase">
                              {c.code}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-emerald-950">{c.name}</p>
                              <p className="text-[10px] text-emerald-700">/{c.slug}</p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-600 text-white text-[9px] font-bold">
                            Assigned Hub
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                    <p className="font-semibold">No Country Hub Assigned</p>
                    <p className="text-[11px] text-amber-800">
                      You currently do not have specific country markets mapped. Inquiries and regional content will require explicit country assignment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3BBA93]" />
                  <span>Security Role & CMS Capabilities</span>
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  System modules authorized for your user account.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
                  <div>
                    <span className="font-bold text-[#2A292D]">{user?.role?.name || 'Administrator Role'}</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {user?.role?.description || 'Standard administrative access to manage site features.'}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {user?.role?.isSystem ? 'System Defined' : 'Custom Role'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Credentials */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Change Password Card */}
          <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#3BBA93]" />
                <span>Change Account Password</span>
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Update your login credentials. You must provide your current password for security verification.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleChangePassword}>
              <CardContent className="p-5 space-y-4 text-xs">
                {passSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                    <span>{passSuccess}</span>
                  </div>
                )}

                {passError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                    <span>{passError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="curr-pass" className="text-xs font-semibold text-gray-700">
                    Current Password *
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <Input
                      id="curr-pass"
                      type={showCurrentPass ? 'text' : 'password'}
                      placeholder="Enter your current password"
                      className="pl-9 pr-10 text-xs bg-gray-50 border-gray-200"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-new-pass" className="text-xs font-semibold text-gray-700">
                    New Password *
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <Input
                      id="profile-new-pass"
                      type={showNewPass ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      className="pl-9 pr-10 text-xs bg-gray-50 border-gray-200"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-confirm-pass" className="text-xs font-semibold text-gray-700">
                    Confirm New Password *
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <Input
                      id="profile-confirm-pass"
                      type={showConfirmPass ? 'text' : 'password'}
                      placeholder="Re-enter your new password"
                      className="pl-9 pr-10 text-xs bg-gray-50 border-gray-200"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      aria-label={showConfirmPass ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-0">
                <Button
                  type="submit"
                  className="bg-[#3BBA93] hover:bg-[#32a481] text-white text-xs font-bold"
                  disabled={isChangingPass}
                >
                  {isChangingPass ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Two-Factor Authentication (2FA) Card */}
          <Card className="bg-white border-gray-200/80 shadow-sm rounded-xl">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-[#2A292D] flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#3BBA93]" />
                  <span>Two-Factor Authentication (2FA)</span>
                </CardTitle>
                <Badge
                  className={
                    twoFactorEnabled
                      ? 'bg-emerald-500/15 text-emerald-700 border-emerald-300 text-[10px] font-bold'
                      : 'bg-gray-100 text-gray-600 border-gray-200 text-[10px] font-semibold'
                  }
                >
                  {twoFactorEnabled ? 'Enabled' : 'Disabled (Default)'}
                </Badge>
              </div>
              <CardDescription className="text-xs text-gray-500 mt-1">
                Protect your CMS administrator session with two-factor verification.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              {twoFactorMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>{twoFactorMessage}</span>
                </div>
              )}

              <p className="text-xs text-gray-600 leading-relaxed">
                By default, two-factor authentication is disabled for all users. When enabled, every sign-in attempt will send a secure 6-digit one-time passcode (OTP) to your corporate email, ensuring only you can access your administrative session.
              </p>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2A292D] text-xs">2FA Authentication State</p>
                  <p className="text-[11px] text-gray-500">
                    {twoFactorEnabled
                      ? 'Account is protected by 2FA authentication.'
                      : 'Account is currently using standard password authentication.'}
                  </p>
                </div>
                <Button
                  onClick={handleToggle2FA}
                  disabled={isToggling2FA}
                  variant={twoFactorEnabled ? 'destructive' : 'default'}
                  size="sm"
                  className={twoFactorEnabled ? 'text-xs' : 'bg-[#3BBA93] hover:bg-[#32a481] text-white text-xs font-bold'}
                >
                  {isToggling2FA ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : twoFactorEnabled ? (
                    'Disable 2FA'
                  ) : (
                    'Enable 2FA'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
