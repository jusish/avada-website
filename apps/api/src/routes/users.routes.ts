import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/permission';
import { logAudit } from '../lib/audit';

const router = Router();
router.use(requireAuth);

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  roleId: z.string().min(1),
  status: z.enum(['ACTIVE', 'INVITED', 'SUSPENDED']).default('ACTIVE'),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  roleId: z.string().optional(),
  password: z.string().min(6).optional(),
  status: z.enum(['ACTIVE', 'INVITED', 'SUSPENDED']).optional(),
});

// GET /api/admin/users
router.get('/', requirePermission('users', 'view'), async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        role: true,
      },
    });

    res.json({
      success: true,
      data: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        roleId: u.roleId,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      })),
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

    const { email, name, password, roleId, status } = parse.data;

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

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        passwordHash,
        roleId,
        status,
      },
      include: { role: true },
    });

    await logAudit({
      req,
      action: 'CREATE_USER',
      entityType: 'User',
      entityId: created.id,
      details: { email: created.email, name: created.name, role: created.role?.name },
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
      },
      message: `User '${created.name}' created successfully`,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, error: 'Failed to create user' });
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

    const updateData: any = { ...parse.data };
    if (parse.data.password) {
      updateData.passwordHash = await bcrypt.hash(parse.data.password, 10);
      delete updateData.password;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });

    await logAudit({
      req,
      action: 'UPDATE_USER',
      entityType: 'User',
      entityId: id,
      details: { email: updated.email, role: updated.role?.name, status: updated.status },
    });

    res.json({
      success: true,
      data: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        roleId: updated.roleId,
        role: updated.role,
        status: updated.status,
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
