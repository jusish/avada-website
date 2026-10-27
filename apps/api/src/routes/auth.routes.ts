import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../lib/audit';
import { EmailService } from '../services/email.service';
import { PermissionMatrix } from '@avada/shared';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'avada_fallback_secret_key';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.errors,
      });
      return;
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        role: true,
        countries: true,
        managedCountries: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    if (user.status === 'SUSPENDED') {
      res.status(403).json({
        success: false,
        error: 'Your account has been suspended. Please contact the administrator.',
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const isSuperAdmin =
      user.email.toLowerCase() === 'admin@avada.com' ||
      user.email.toLowerCase().startsWith('admin@') ||
      user.role?.name?.toLowerCase().includes('super admin') ||
      user.role?.name === 'Super Administrator';

    const userCountries = [...(user.countries || []), ...(user.managedCountries || [])];
    const countryMap = new Map<string, (typeof userCountries)[0]>();
    for (const c of userCountries) {
      countryMap.set(c.id, c);
    }
    const uniqueCountries = Array.from(countryMap.values());
    const assignedCountryIds = uniqueCountries.map((c) => c.id);

    // Audit log login
    await logAudit({
      req: {
        ...req,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId || undefined,
          roleName: user.role?.name || 'Administrator',
          permissions: (user.role?.permissions as unknown as PermissionMatrix) || ({} as PermissionMatrix),
          isSuperAdmin,
          assignedCountryIds,
          assignedCountryNames: uniqueCountries.map((c) => c.name),
          assignedCountrySlugs: uniqueCountries.map((c) => c.slug.toLowerCase()),
        },
      } as AuthenticatedRequest,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email, role: user.role?.name },
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId,
          role: user.role,
          status: user.status,
          mustChangePassword: user.mustChangePassword,
          twoFactorEnabled: user.twoFactorEnabled,
          isSuperAdmin,
          assignedCountryIds,
          countries: uniqueCountries.map((c) => ({
            ...c,
            telcoPartners: (c.telcoPartners as string[]) || [],
            paymentRails: (c.paymentRails as string[]) || [],
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
          })),
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during authentication',
    });
  }
});

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        role: true,
        countries: true,
        managedCountries: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const isSuperAdmin =
      user.email.toLowerCase() === 'admin@avada.com' ||
      user.email.toLowerCase().startsWith('admin@') ||
      user.role?.name?.toLowerCase().includes('super admin') ||
      user.role?.name === 'Super Administrator';

    const userCountries = [...(user.countries || []), ...(user.managedCountries || [])];
    const countryMap = new Map<string, (typeof userCountries)[0]>();
    for (const c of userCountries) {
      countryMap.set(c.id, c);
    }
    const uniqueCountries = Array.from(countryMap.values());
    const assignedCountryIds = uniqueCountries.map((c) => c.id);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId,
          role: user.role,
          status: user.status,
          mustChangePassword: user.mustChangePassword,
          twoFactorEnabled: user.twoFactorEnabled,
          isSuperAdmin,
          assignedCountryIds,
          countries: uniqueCountries.map((c) => ({
            ...c,
            telcoPartners: (c.telcoPartners as string[]) || [],
            paymentRails: (c.paymentRails as string[]) || [],
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
          })),
        },
      },
    });
  } catch (error) {
    console.error('Fetch me error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve profile' });
  }
});

// ==========================================
// Forgot Password & Tokenized Reset
// ==========================================

const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = forgotPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: 'Invalid email address provided' });
      return;
    }

    const { email } = parseResult.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Return generic success even if user not found to prevent email enumeration
    if (!user || user.status === 'SUSPENDED') {
      res.json({
        success: true,
        message: 'If an account exists with this email address, a password reset link has been dispatched.',
      });
      return;
    }

    // Invalidate any existing unused reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    // Generate secure random 64-character token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const appUrl = process.env.APP_URL || 'https://avadapay.com';
    const resetUrl = `${appUrl}/admin/reset-password?token=${token}`;

    await EmailService.sendPasswordReset({
      email: user.email,
      name: user.name,
      resetUrl,
      expiresInMinutes: 60,
    });

    res.json({
      success: true,
      message: 'If an account exists with this email address, a password reset link has been dispatched.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, error: 'Failed to process password reset request' });
  }
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = resetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.errors,
      });
      return;
    }

    const { token, newPassword } = parseResult.data;

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      res.status(400).json({
        success: false,
        error: 'This password reset link is invalid or has expired. Please request a new one.',
      });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user password, clear mustChangePassword, set ACTIVE if was INVITED
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: {
          passwordHash,
          mustChangePassword: false,
          status: 'ACTIVE',
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await logAudit({
      req: {
        ...req,
        user: {
          id: resetRecord.user.id,
          email: resetRecord.user.email,
          name: resetRecord.user.name,
          permissions: {} as PermissionMatrix,
          isSuperAdmin: false,
          assignedCountryIds: [],
          assignedCountryNames: [],
          assignedCountrySlugs: [],
        },
      } as unknown as AuthenticatedRequest,
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'User',
      entityId: resetRecord.userId,
      details: { email: resetRecord.user.email },
    });

    res.json({
      success: true,
      message: 'Password has been successfully updated. You may now sign in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
});

// ==========================================
// Change Password (In Profile)
// ==========================================

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

router.post('/change-password', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const parseResult = changePasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.errors,
      });
      return;
    }

    const { currentPassword, newPassword } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const isValidCurrent = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidCurrent) {
      res.status(400).json({ success: false, error: 'The current password you entered is incorrect.' });
      return;
    }

    const isSame = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSame) {
      res.status(400).json({ success: false, error: 'New password cannot be the same as your current password.' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        mustChangePassword: false,
      },
    });

    await logAudit({
      req,
      action: 'USER_PASSWORD_CHANGED',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email },
    });

    res.json({
      success: true,
      message: 'Your password has been changed successfully.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, error: 'Failed to change password' });
  }
});

// ==========================================
// Set Password (First-Time Login with Temp Pass)
// ==========================================

const setPasswordSchema = z.object({
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

router.post('/set-password', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const parseResult = setPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.errors,
      });
      return;
    }

    const { newPassword } = parseResult.data;
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        passwordHash,
        mustChangePassword: false,
        status: 'ACTIVE',
      },
      include: {
        role: true,
        countries: true,
        managedCountries: true,
      },
    });

    await logAudit({
      req,
      action: 'FIRST_LOGIN_PASSWORD_SET',
      entityType: 'User',
      entityId: updatedUser.id,
      details: { email: updatedUser.email },
    });

    const userCountries = [...(updatedUser.countries || []), ...(updatedUser.managedCountries || [])];
    const countryMap = new Map<string, (typeof userCountries)[0]>();
    for (const c of userCountries) {
      countryMap.set(c.id, c);
    }
    const uniqueCountries = Array.from(countryMap.values());
    const assignedCountryIds = uniqueCountries.map((c) => c.id);

    res.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          roleId: updatedUser.roleId,
          role: updatedUser.role,
          status: updatedUser.status,
          mustChangePassword: updatedUser.mustChangePassword,
          twoFactorEnabled: updatedUser.twoFactorEnabled,
          isSuperAdmin: req.user.isSuperAdmin,
          assignedCountryIds,
          countries: uniqueCountries,
        },
      },
      message: 'Permanent password set successfully. Welcome to AvadaPay CMS!',
    });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ success: false, error: 'Failed to set password' });
  }
});

// ==========================================
// 2FA Status Toggle
// ==========================================

router.patch('/2fa/toggle', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const new2FAStatus = !user.twoFactorEnabled;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: new2FAStatus },
    });

    await logAudit({
      req,
      action: '2FA_STATUS_TOGGLED',
      entityType: 'User',
      entityId: user.id,
      details: { email: user.email, twoFactorEnabled: new2FAStatus },
    });

    res.json({
      success: true,
      twoFactorEnabled: updated.twoFactorEnabled,
      message: `Two-factor authentication has been ${new2FAStatus ? 'enabled' : 'disabled'}.`,
    });
  } catch (error) {
    console.error('Toggle 2FA error:', error);
    res.status(500).json({ success: false, error: 'Failed to update 2FA configuration' });
  }
});

export default router;
