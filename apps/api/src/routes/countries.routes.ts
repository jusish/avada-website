import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/permission';
import { logAudit } from '../lib/audit';

const router = Router();
router.use(requireAuth);

const countrySchema = z.object({
  code: z.string().min(2).max(4).toLowerCase(),
  slug: z.string().min(2).toLowerCase(),
  name: z.string().min(2),
  currencyCode: z.string().default('USD'),
  headline: z.string().min(3),
  tagline: z.string().default(''),
  description: z.string().min(5),
  telcoPartners: z.array(z.string()).default([]),
  paymentRails: z.array(z.string()).default([]),
  pricingSummary: z.string().optional().nullable(),
  officeAddress: z.string().optional().nullable(),
  officePhone: z.string().optional().nullable(),
  officeEmail: z.string().optional().nullable(),
  mapEmbedUrl: z.string().optional().nullable(),
  active: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

// GET /api/admin/countries
router.get('/', requirePermission('countries', 'view'), async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    res.json({
      success: true,
      data: countries.map((c) => ({
        ...c,
        telcoPartners: (c.telcoPartners as string[]) || [],
        paymentRails: (c.paymentRails as string[]) || [],
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Fetch admin countries error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch countries' });
  }
});

// POST /api/admin/countries
router.post('/', requirePermission('countries', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parse = countrySchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parse.error.errors });
      return;
    }

    const data = parse.data;

    // Check duplicate code or slug
    const existing = await prisma.country.findFirst({
      where: { OR: [{ code: data.code }, { slug: data.slug }] },
    });

    if (existing) {
      res.status(400).json({ success: false, error: 'A country with this code or slug already exists.' });
      return;
    }

    const created = await prisma.country.create({
      data: {
        ...data,
        telcoPartners: data.telcoPartners,
        paymentRails: data.paymentRails,
      },
    });

    await logAudit({
      req,
      action: 'CREATE_COUNTRY',
      entityType: 'Country',
      entityId: created.id,
      details: { name: created.name, slug: created.slug, code: created.code },
    });

    res.status(201).json({
      success: true,
      data: created,
      message: `Country ${created.name} added successfully`,
    });
  } catch (error) {
    console.error('Create country error:', error);
    res.status(500).json({ success: false, error: 'Failed to create country' });
  }
});

// PUT /api/admin/countries/:id
router.put('/:id', requirePermission('countries', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parse = countrySchema.partial().safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parse.error.errors });
      return;
    }

    const existing = await prisma.country.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Country not found' });
      return;
    }

    const updated = await prisma.country.update({
      where: { id },
      data: parse.data,
    });

    await logAudit({
      req,
      action: 'UPDATE_COUNTRY',
      entityType: 'Country',
      entityId: updated.id,
      details: { before: existing, after: updated },
    });

    res.json({
      success: true,
      data: updated,
      message: `Country ${updated.name} updated successfully`,
    });
  } catch (error) {
    console.error('Update country error:', error);
    res.status(500).json({ success: false, error: 'Failed to update country' });
  }
});

// PATCH /api/admin/countries/:id/toggle
router.patch('/:id/toggle', requirePermission('countries', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.country.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Country not found' });
      return;
    }

    const updated = await prisma.country.update({
      where: { id },
      data: { active: !existing.active },
    });

    await logAudit({
      req,
      action: updated.active ? 'ENABLE_COUNTRY' : 'DISABLE_COUNTRY',
      entityType: 'Country',
      entityId: updated.id,
      details: { name: updated.name, active: updated.active },
    });

    res.json({
      success: true,
      data: updated,
      message: `Country ${updated.name} is now ${updated.active ? 'active' : 'inactive'}`,
    });
  } catch (error) {
    console.error('Toggle country error:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle country status' });
  }
});

// DELETE /api/admin/countries/:id
router.delete('/:id', requirePermission('countries', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.country.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Country not found' });
      return;
    }

    await prisma.country.delete({ where: { id } });

    await logAudit({
      req,
      action: 'DELETE_COUNTRY',
      entityType: 'Country',
      entityId: id,
      details: { deleted: existing },
    });

    res.json({
      success: true,
      message: `Country ${existing.name} has been removed.`,
    });
  } catch (error) {
    console.error('Delete country error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete country' });
  }
});

export default router;
