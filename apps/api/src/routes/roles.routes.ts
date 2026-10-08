import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/permission';
import { logAudit } from '../lib/audit';

const router = Router();
router.use(requireAuth);

const roleSchema = z.object({
  name: z.string().min(2),
  description: z.string().default(''),
  permissions: z.record(z.object({
    view: z.boolean(),
    edit: z.boolean(),
  })),
});

// GET /api/admin/roles
router.get('/', requirePermission('roles', 'view'), async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    res.json({
      success: true,
      data: roles.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Fetch roles error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch roles' });
  }
});

// POST /api/admin/roles
router.post('/', requirePermission('roles', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parse = roleSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parse.error.errors });
      return;
    }

    const { name, description, permissions } = parse.data;

    const existing = await prisma.role.findUnique({ where: { name } });
    if (existing) {
      res.status(400).json({ success: false, error: `Role '${name}' already exists.` });
      return;
    }

    const created = await prisma.role.create({
      data: {
        name,
        description,
        permissions,
        isSystem: false,
      },
    });

    await logAudit({
      req,
      action: 'CREATE_ROLE',
      entityType: 'Role',
      entityId: created.id,
      details: { name, permissions },
    });

    res.status(201).json({
      success: true,
      data: created,
      message: `Role '${name}' created successfully`,
    });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ success: false, error: 'Failed to create role' });
  }
});

// PUT /api/admin/roles/:id
router.put('/:id', requirePermission('roles', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parse = roleSchema.partial().safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parse.error.errors });
      return;
    }

    const existing = await prisma.role.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Role not found' });
      return;
    }

    const updated = await prisma.role.update({
      where: { id },
      data: parse.data,
    });

    await logAudit({
      req,
      action: 'UPDATE_ROLE',
      entityType: 'Role',
      entityId: id,
      details: { name: updated.name, permissions: updated.permissions },
    });

    res.json({
      success: true,
      data: updated,
      message: `Role '${updated.name}' updated successfully`,
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ success: false, error: 'Failed to update role' });
  }
});

// DELETE /api/admin/roles/:id
router.delete('/:id', requirePermission('roles', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });

    if (!existing) {
      res.status(404).json({ success: false, error: 'Role not found' });
      return;
    }

    if (existing.isSystem) {
      res.status(400).json({ success: false, error: 'System roles cannot be deleted.' });
      return;
    }

    if (existing._count.users > 0) {
      res.status(400).json({
        success: false,
        error: `Cannot delete role '${existing.name}' because it is assigned to ${existing._count.users} user(s). Reassign them first.`,
      });
      return;
    }

    await prisma.role.delete({ where: { id } });

    await logAudit({
      req,
      action: 'DELETE_ROLE',
      entityType: 'Role',
      entityId: id,
      details: { deletedRole: existing.name },
    });

    res.json({
      success: true,
      message: `Role '${existing.name}' deleted successfully`,
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete role' });
  }
});

export default router;
