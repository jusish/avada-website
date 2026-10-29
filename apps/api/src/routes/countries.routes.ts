import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/permission';
import { logAudit } from '../lib/audit';

const router = Router();
router.use(requireAuth);

const countrySchema = z.object({
  code: z
    .string()
    .min(2)
    .max(4)
    .transform((v) => v.trim().toUpperCase()),
  slug: z.string().min(2).toLowerCase(),
  name: z.string().min(2),
  currencyCode: z
    .string()
    .default('USD')
    .transform((v) => v.trim().toUpperCase()),
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
  managerId: z.string().optional().nullable(),
  notificationSettings: z.any().optional().nullable(),
  active: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

// GET /api/admin/countries
router.get('/', requirePermission('countries', 'view'), async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        manager: {
          select: { id: true, name: true, email: true },
        },
        users: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { inquiries: true },
        },
      },
    });

    res.json({
      success: true,
      data: countries.map((c) => ({
        ...c,
        code: c.code.toUpperCase(),
        currencyCode: c.currencyCode.toUpperCase(),
        telcoPartners: (c.telcoPartners as string[]) || [],
        paymentRails: (c.paymentRails as string[]) || [],
        assignedUserIds: c.users.map((u) => u.id),
        inquiriesCount: c._count.inquiries,
        notificationSettings: c.notificationSettings || {
          notifyOfficeEmail: true,
          notifyManagerEmail: true,
          extraRecipients: [],
        },
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Fetch admin countries error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch countries' });
  }
});

// GET /api/admin/countries/:id
router.get('/:id', requirePermission('countries', 'view'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const country = await prisma.country.findUnique({
      where: { id },
      include: {
        manager: {
          select: { id: true, name: true, email: true },
        },
        users: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { inquiries: true },
        },
      },
    });

    if (!country) {
      res.status(404).json({ success: false, error: 'Country not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        ...country,
        code: country.code.toUpperCase(),
        currencyCode: country.currencyCode.toUpperCase(),
        telcoPartners: (country.telcoPartners as string[]) || [],
        paymentRails: (country.paymentRails as string[]) || [],
        assignedUserIds: country.users.map((u) => u.id),
        inquiriesCount: country._count.inquiries,
        notificationSettings: country.notificationSettings || {
          notifyOfficeEmail: true,
          notifyManagerEmail: true,
          extraRecipients: [],
        },
        createdAt: country.createdAt.toISOString(),
        updatedAt: country.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Fetch country details error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch country details' });
  }
});

// POST /api/admin/countries
router.post('/', requirePermission('countries', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.isSuperAdmin) {
      res.status(403).json({ success: false, error: 'Only Super Administrators can create new country market hubs.' });
      return;
    }

    const parse = countrySchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parse.error.errors });
      return;
    }

    const data = parse.data;

    // Check duplicate code or slug
    const existing = await prisma.country.findFirst({
      where: {
        OR: [
          { code: data.code },
          { code: data.code.toLowerCase() },
          { slug: data.slug },
        ],
      },
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
      include: {
        manager: {
          select: { id: true, name: true, email: true },
        },
        users: {
          select: { id: true, name: true, email: true },
        },
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

    const isSuper = req.user?.isSuperAdmin;
    const isAssigned = req.user?.assignedCountryIds?.includes(id);
    if (!isSuper && !isAssigned) {
      res.status(403).json({ success: false, error: 'Access denied. You can only edit country hubs assigned to your profile.' });
      return;
    }

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

    if (parse.data.code || parse.data.slug) {
      const conflict = await prisma.country.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(parse.data.code ? [{ code: parse.data.code }, { code: parse.data.code.toLowerCase() }] : []),
            ...(parse.data.slug ? [{ slug: parse.data.slug }] : []),
          ],
        },
      });
      if (conflict) {
        res.status(400).json({ success: false, error: 'A country with this code or slug already exists.' });
        return;
      }
    }

    // Only super admin can reassign country manager
    const updatePayload = { ...parse.data };
    if (!isSuper && updatePayload.managerId !== undefined) {
      delete updatePayload.managerId;
    }

    const updated = await prisma.country.update({
      where: { id },
      data: updatePayload,
      include: {
        manager: {
          select: { id: true, name: true, email: true },
        },
        users: {
          select: { id: true, name: true, email: true },
        },
      },
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
      data: {
        ...updated,
        code: updated.code.toUpperCase(),
        currencyCode: updated.currencyCode.toUpperCase(),
        telcoPartners: (updated.telcoPartners as string[]) || [],
        paymentRails: (updated.paymentRails as string[]) || [],
        assignedUserIds: updated.users.map((u) => u.id),
        notificationSettings: updated.notificationSettings || {
          notifyOfficeEmail: true,
          notifyManagerEmail: true,
          extraRecipients: [],
        },
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
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
    const isSuper = req.user?.isSuperAdmin;
    const isAssigned = req.user?.assignedCountryIds?.includes(id);
    if (!isSuper && !isAssigned) {
      res.status(403).json({ success: false, error: 'Access denied. You cannot modify status for unassigned countries.' });
      return;
    }

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
    if (!req.user?.isSuperAdmin) {
      res.status(403).json({ success: false, error: 'Only Super Administrators can delete country market hubs.' });
      return;
    }

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
