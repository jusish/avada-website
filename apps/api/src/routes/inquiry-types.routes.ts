import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/permission';
import { logAudit } from '../lib/audit';

const router = Router();
router.use(requireAuth);

const inquiryTypeSchema = z.object({
  key: z.string().min(2).toLowerCase(),
  label: z.string().min(2),
  description: z.string().optional().nullable(),
  active: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

// GET /api/admin/inquiry-types
router.get('/', requirePermission('inquiry_types', 'view'), async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const types = await prisma.inquiryType.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    res.json({
      success: true,
      data: types.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Fetch inquiry types error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inquiry types' });
  }
});

// POST /api/admin/inquiry-types
router.post('/', requirePermission('inquiry_types', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parse = inquiryTypeSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parse.error.errors });
      return;
    }

    const { key, label, description, active, displayOrder } = parse.data;

    const existing = await prisma.inquiryType.findUnique({ where: { key } });
    if (existing) {
      res.status(400).json({ success: false, error: 'Inquiry type with this key already exists' });
      return;
    }

    const created = await prisma.inquiryType.create({
      data: { key, label, description, active, displayOrder },
    });

    await logAudit({
      req,
      action: 'CREATE_INQUIRY_TYPE',
      entityType: 'InquiryType',
      entityId: created.id,
      details: { key, label },
    });

    res.status(201).json({
      success: true,
      data: created,
      message: 'Inquiry type added successfully',
    });
  } catch (error) {
    console.error('Create inquiry type error:', error);
    res.status(500).json({ success: false, error: 'Failed to create inquiry type' });
  }
});

// PUT /api/admin/inquiry-types/:id
router.put('/:id', requirePermission('inquiry_types', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parse = inquiryTypeSchema.partial().safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parse.error.errors });
      return;
    }

    const existing = await prisma.inquiryType.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Inquiry type not found' });
      return;
    }

    const updated = await prisma.inquiryType.update({
      where: { id },
      data: parse.data,
    });

    await logAudit({
      req,
      action: 'UPDATE_INQUIRY_TYPE',
      entityType: 'InquiryType',
      entityId: updated.id,
      details: { before: existing, after: updated },
    });

    res.json({
      success: true,
      data: updated,
      message: 'Inquiry type updated successfully',
    });
  } catch (error) {
    console.error('Update inquiry type error:', error);
    res.status(500).json({ success: false, error: 'Failed to update inquiry type' });
  }
});

// PATCH /api/admin/inquiry-types/:id/toggle
router.patch('/:id/toggle', requirePermission('inquiry_types', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.inquiryType.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Inquiry type not found' });
      return;
    }

    const updated = await prisma.inquiryType.update({
      where: { id },
      data: { active: !existing.active },
    });

    await logAudit({
      req,
      action: updated.active ? 'ENABLE_INQUIRY_TYPE' : 'DISABLE_INQUIRY_TYPE',
      entityType: 'InquiryType',
      entityId: updated.id,
      details: { key: updated.key, active: updated.active },
    });

    res.json({
      success: true,
      data: updated,
      message: `Inquiry type is now ${updated.active ? 'active' : 'inactive'}`,
    });
  } catch (error) {
    console.error('Toggle inquiry type error:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle inquiry type' });
  }
});

// DELETE /api/admin/inquiry-types/:id
router.delete('/:id', requirePermission('inquiry_types', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.inquiryType.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Inquiry type not found' });
      return;
    }

    await prisma.inquiryType.delete({ where: { id } });

    await logAudit({
      req,
      action: 'DELETE_INQUIRY_TYPE',
      entityType: 'InquiryType',
      entityId: id,
      details: { deleted: existing },
    });

    res.json({
      success: true,
      message: 'Inquiry type deleted successfully',
    });
  } catch (error) {
    console.error('Delete inquiry type error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete inquiry type' });
  }
});

export default router;
