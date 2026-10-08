import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/permission';
import { logAudit } from '../lib/audit';

const router = Router();
router.use(requireAuth);

const policySchema = z.object({
  slug: z.string().min(2).toLowerCase(),
  title: z.string().min(2),
  summary: z.string().optional().nullable(),
  content: z.string().min(5),
  version: z.string().default('1.0'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  effectiveDate: z.string().optional(),
});

// GET /api/admin/policies
router.get('/', requirePermission('policies', 'view'), async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const policies = await prisma.legalPolicy.findMany({
      orderBy: { title: 'asc' },
    });

    res.json({
      success: true,
      data: policies.map((p) => ({
        ...p,
        effectiveDate: p.effectiveDate.toISOString(),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Fetch policies error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch legal policies' });
  }
});

// POST /api/admin/policies
router.post('/', requirePermission('policies', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parse = policySchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parse.error.errors });
      return;
    }

    const { slug, title, summary, content, version, status, effectiveDate } = parse.data;

    const existing = await prisma.legalPolicy.findUnique({ where: { slug } });
    if (existing) {
      res.status(400).json({ success: false, error: `Policy with slug '${slug}' already exists.` });
      return;
    }

    const created = await prisma.legalPolicy.create({
      data: {
        slug,
        title,
        summary,
        content,
        version,
        status,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
      },
    });

    await logAudit({
      req,
      action: 'CREATE_POLICY',
      entityType: 'LegalPolicy',
      entityId: created.id,
      details: { slug, title, version },
    });

    res.status(201).json({
      success: true,
      data: created,
      message: `Policy '${title}' created successfully`,
    });
  } catch (error) {
    console.error('Create policy error:', error);
    res.status(500).json({ success: false, error: 'Failed to create policy' });
  }
});

// PUT /api/admin/policies/:id
router.put('/:id', requirePermission('policies', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parse = policySchema.partial().safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parse.error.errors });
      return;
    }

    const existing = await prisma.legalPolicy.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Policy not found' });
      return;
    }

    const updateData: any = { ...parse.data };
    if (parse.data.effectiveDate) {
      updateData.effectiveDate = new Date(parse.data.effectiveDate);
    }

    const updated = await prisma.legalPolicy.update({
      where: { id },
      data: updateData,
    });

    await logAudit({
      req,
      action: 'UPDATE_POLICY',
      entityType: 'LegalPolicy',
      entityId: id,
      details: { slug: updated.slug, version: updated.version, status: updated.status },
    });

    res.json({
      success: true,
      data: updated,
      message: `Policy '${updated.title}' updated successfully`,
    });
  } catch (error) {
    console.error('Update policy error:', error);
    res.status(500).json({ success: false, error: 'Failed to update policy' });
  }
});

// DELETE /api/admin/policies/:id
router.delete('/:id', requirePermission('policies', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.legalPolicy.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Policy not found' });
      return;
    }

    await prisma.legalPolicy.delete({ where: { id } });

    await logAudit({
      req,
      action: 'DELETE_POLICY',
      entityType: 'LegalPolicy',
      entityId: id,
      details: { deleted: existing.slug, title: existing.title },
    });

    res.json({
      success: true,
      message: `Policy '${existing.title}' deleted successfully`,
    });
  } catch (error) {
    console.error('Delete policy error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete policy' });
  }
});

export default router;
