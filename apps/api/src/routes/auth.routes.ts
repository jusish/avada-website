import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { logAudit } from '../lib/audit';
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

export default router;
