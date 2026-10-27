import { Router, Response } from 'express';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/permission';
import { logAudit } from '../lib/audit';
import { EmailService } from '../services/email.service';

const router = Router();
router.use(requireAuth);

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6).optional(),
  roleId: z.string().min(1),
  status: z.enum(['ACTIVE', 'INVITED', 'SUSPENDED']).default('INVITED'),
  countryIds: z.array(z.string()).optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  roleId: z.string().optional(),
  password: z.string().min(6).optional(),
  status: z.enum(['ACTIVE', 'INVITED', 'SUSPENDED']).optional(),
  countryIds: z.array(z.string()).optional(),
});

// GET /api/admin/users
router.get('/', requirePermission('users', 'view'), async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        role: true,
        countries: true,
        managedCountries: true,
      },
    });

    res.json({
      success: true,
      data: users.map((u) => {
        const userCountries = [...(u.countries || []), ...(u.managedCountries || [])];
        const countryMap = new Map<string, (typeof userCountries)[0]>();
        for (const c of userCountries) {
          countryMap.set(c.id, c);
        }
        const uniqueCountries = Array.from(countryMap.values());
        const assignedCountryIds = uniqueCountries.map((c) => c.id);

        return {
          id: u.id,
          email: u.email,
          name: u.name,
          roleId: u.roleId,
          role: u.role,
          status: u.status,
          mustChangePassword: u.mustChangePassword,
          twoFactorEnabled: u.twoFactorEnabled,
          countries: uniqueCountries,
          assignedCountryIds,
          managedCountries: u.managedCountries,
          createdAt: u.createdAt.toISOString(),
          updatedAt: u.updatedAt.toISOString(),
        };
      }),
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// POST /api/admin/users
router.post('/', requirePermission('users', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parse = createUserSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parse.error.errors });
      return;
    }

    const { email, name, password, roleId, status, countryIds } = parse.data;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      res.status(400).json({ success: false, error: `A user with email '${email}' already exists.` });
      return;
    }

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      res.status(400).json({ success: false, error: 'Specified role not found' });
      return;
    }

    // Generate clean temporary password if not provided or when creating an invited team member
    const tempPassword = password?.trim() || ('Avada#' + crypto.randomBytes(4).toString('hex').toUpperCase() + '!');
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    const userStatus = status || 'INVITED';
    const mustChangePassword = userStatus === 'INVITED' || !password;

    const created = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        roleId,
        status: userStatus,
        mustChangePassword,
        ...(countryIds && countryIds.length > 0
          ? {
              countries: {
                connect: countryIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        role: true,
        countries: true,
        managedCountries: true,
      },
    });

    await logAudit({
      req,
      action: 'CREATE_USER',
      entityType: 'User',
      entityId: created.id,
      details: { email: created.email, name: created.name, role: created.role?.name, assignedCountries: countryIds, status: userStatus },
    });

    // Automatically send invitation email with temporary credentials
    const marketHubs = created.countries.map((c) => c.name);
    await EmailService.sendTeamInvitation({
      email: created.email,
      name: created.name,
      temporaryPassword: tempPassword,
      roleName: role.name,
      marketHubs,
    });

    res.status(201).json({
      success: true,
      data: {
        id: created.id,
        email: created.email,
        name: created.name,
        roleId: created.roleId,
        role: created.role,
        status: created.status,
        mustChangePassword: created.mustChangePassword,
        twoFactorEnabled: created.twoFactorEnabled,
        countries: created.countries,
        assignedCountryIds: created.countries.map((c) => c.id),
      },
      message: `Team member '${created.name}' created and invitation email dispatched successfully.`,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, error: 'Failed to create user' });
  }
});

// POST /api/admin/users/:id/resend-invite
router.post('/:id/resend-invite', requirePermission('users', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
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

    if (user.status === 'SUSPENDED') {
      res.status(400).json({ success: false, error: 'Cannot send invitation to a suspended account.' });
      return;
    }

    // Generate a fresh new temporary password
    const newTempPassword = 'Avada#' + crypto.randomBytes(4).toString('hex').toUpperCase() + '!';
    const passwordHash = await bcrypt.hash(newTempPassword, 10);

    const updated = await prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        mustChangePassword: true,
        status: 'INVITED',
      },
      include: {
        role: true,
        countries: true,
        managedCountries: true,
      },
    });

    const marketHubs = [...(updated.countries || []), ...(updated.managedCountries || [])].map((c) => c.name);

    await EmailService.sendTeamInvitation({
      email: updated.email,
      name: updated.name,
      temporaryPassword: newTempPassword,
      roleName: updated.role?.name || 'Team Member',
      marketHubs,
    });

    await logAudit({
      req,
      action: 'INVITATION_RESENT',
      entityType: 'User',
      entityId: updated.id,
      details: { email: updated.email },
    });

    res.json({
      success: true,
      message: `A fresh invitation email with new temporary credentials has been sent to ${updated.email}.`,
    });
  } catch (error) {
    console.error('Resend invite error:', error);
    res.status(500).json({ success: false, error: 'Failed to resend invitation' });
  }
});

// PUT /api/admin/users/:id
router.put('/:id', requirePermission('users', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parse = updateUserSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parse.error.errors });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const { password, countryIds, ...fields } = parse.data;
    const updateData: Prisma.UserUpdateInput = { ...fields };
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }
    if (countryIds !== undefined) {
      updateData.countries = {
        set: countryIds.map((cid) => ({ id: cid })),
      };
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
        countries: true,
        managedCountries: true,
      },
    });

    await logAudit({
      req,
      action: 'UPDATE_USER',
      entityType: 'User',
      entityId: id,
      details: { email: updated.email, role: updated.role?.name, status: updated.status, assignedCountries: countryIds },
    });

    const userCountries = [...(updated.countries || []), ...(updated.managedCountries || [])];
    const countryMap = new Map<string, (typeof userCountries)[0]>();
    for (const c of userCountries) {
      countryMap.set(c.id, c);
    }
    const uniqueCountries = Array.from(countryMap.values());

    res.json({
      success: true,
      data: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        roleId: updated.roleId,
        role: updated.role,
        status: updated.status,
        countries: uniqueCountries,
        assignedCountryIds: uniqueCountries.map((c) => c.id),
      },
      message: `User '${updated.name}' updated successfully`,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

// PATCH /api/admin/users/:id/status
router.patch('/:id/status', requirePermission('users', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'INVITED', 'SUSPENDED'].includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid user status' });
      return;
    }

    if (req.user?.id === id) {
      res.status(400).json({ success: false, error: 'You cannot change your own status.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status },
      include: { role: true },
    });

    await logAudit({
      req,
      action: 'CHANGE_USER_STATUS',
      entityType: 'User',
      entityId: id,
      details: { email: updated.email, status },
    });

    res.json({
      success: true,
      data: updated,
      message: `User status changed to ${status}`,
    });
  } catch (error) {
    console.error('Change status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update user status' });
  }
});

// POST & PATCH /api/admin/users/:id/toggle-status
const handleToggleUserStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user?.id === id) {
      res.status(400).json({ success: false, error: 'You cannot change your own administrator status.' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { id }, include: { role: true } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const nextStatus = existing.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = await prisma.user.update({
      where: { id },
      data: { status: nextStatus },
      include: { role: true },
    });

    await logAudit({
      req,
      action: 'CHANGE_USER_STATUS',
      entityType: 'User',
      entityId: id,
      details: { email: updated.email, status: nextStatus },
    });

    res.json({
      success: true,
      data: updated,
      message: `User status changed to ${nextStatus}`,
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle user status' });
  }
};

router.post('/:id/toggle-status', requirePermission('users', 'edit'), handleToggleUserStatus);
router.patch('/:id/toggle-status', requirePermission('users', 'edit'), handleToggleUserStatus);

// DELETE /api/admin/users/:id
router.delete('/:id', requirePermission('users', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user?.id === id) {
      res.status(400).json({ success: false, error: 'You cannot delete your own administrator account.' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    await prisma.user.delete({ where: { id } });

    await logAudit({
      req,
      action: 'DELETE_USER',
      entityType: 'User',
      entityId: id,
      details: { deletedEmail: existing.email, name: existing.name },
    });

    res.json({
      success: true,
      message: `User '${existing.name}' has been deleted.`,
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
});

export default router;
