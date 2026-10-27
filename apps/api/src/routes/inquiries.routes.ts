import { Router, Response } from 'express';
import { Prisma, InquiryStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/permission';
import { logAudit } from '../lib/audit';

const router = Router();
router.use(requireAuth);

function getUserCountryScope(user: AuthenticatedRequest['user']): Prisma.ContactInquiryWhereInput | null {
  if (!user || user.isSuperAdmin) {
    return null;
  }
  if (!user.assignedCountryIds || user.assignedCountryIds.length === 0) {
    return { id: 'no-access-assigned' };
  }
  return {
    OR: [
      { countryId: { in: user.assignedCountryIds } },
      ...user.assignedCountryNames.map((name) => ({ country: { contains: name, mode: 'insensitive' as const } })),
      ...user.assignedCountrySlugs.map((slug) => ({ country: { contains: slug, mode: 'insensitive' as const } })),
    ],
  };
}

function isUserAuthorizedForInquiry(
  user: AuthenticatedRequest['user'],
  inquiry: { countryId?: string | null; country: string }
): boolean {
  if (!user || user.isSuperAdmin) {
    return true;
  }
  if (!user.assignedCountryIds || user.assignedCountryIds.length === 0) {
    return false;
  }
  if (inquiry.countryId && user.assignedCountryIds.includes(inquiry.countryId)) {
    return true;
  }
  const inqCountry = inquiry.country.toLowerCase().trim();
  const matchedName = user.assignedCountryNames.some(
    (n) => inqCountry.includes(n.toLowerCase()) || n.toLowerCase().includes(inqCountry)
  );
  const matchedSlug = user.assignedCountrySlugs.some(
    (s) => inqCountry.includes(s) || s.includes(inqCountry)
  );
  return matchedName || matchedSlug;
}

// GET /api/admin/inquiries
router.get('/', requirePermission('inquiries', 'view'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { country, inquiryType, status, search } = req.query;

    const whereConditions: Prisma.ContactInquiryWhereInput[] = [];

    const scopeFilter = getUserCountryScope(req.user);
    if (scopeFilter) {
      whereConditions.push(scopeFilter);
    }

    if (country && typeof country === 'string' && country !== 'all') {
      whereConditions.push({ country: { contains: country, mode: 'insensitive' } });
    }
    if (inquiryType && typeof inquiryType === 'string' && inquiryType !== 'all') {
      whereConditions.push({ inquiryType });
    }
    if (status && typeof status === 'string' && status !== 'all') {
      whereConditions.push({ status: status as InquiryStatus });
    }
    if (search && typeof search === 'string') {
      whereConditions.push({
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { orgName: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    const where: Prisma.ContactInquiryWhereInput = whereConditions.length > 0 ? { AND: whereConditions } : {};

    const items = await prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        handledBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json({
      success: true,
      data: items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        handledAt: item.handledAt?.toISOString() || null,
      })),
    });
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inquiries' });
  }
});

// GET /api/admin/inquiries/stats
router.get('/stats', requirePermission('inquiries', 'view'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const scopeFilter = getUserCountryScope(req.user);
    const baseWhere: Prisma.ContactInquiryWhereInput = scopeFilter || {};

    const [total, unread, contacted, resolved] = await Promise.all([
      prisma.contactInquiry.count({ where: baseWhere }),
      prisma.contactInquiry.count({ where: { ...baseWhere, status: 'UNREAD' } }),
      prisma.contactInquiry.count({ where: { ...baseWhere, status: 'CONTACTED' } }),
      prisma.contactInquiry.count({ where: { ...baseWhere, status: 'RESOLVED' } }),
    ]);

    res.json({
      success: true,
      data: { total, unread, contacted, resolved },
    });
  } catch (error) {
    console.error('Fetch inquiry stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inquiry statistics' });
  }
});

// GET /api/admin/inquiries/:id
router.get('/:id', requirePermission('inquiries', 'view'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await prisma.contactInquiry.findUnique({
      where: { id },
      include: {
        handledBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!item) {
      res.status(404).json({ success: false, error: 'Inquiry not found' });
      return;
    }

    if (!isUserAuthorizedForInquiry(req.user, item)) {
      res.status(403).json({ success: false, error: 'Access denied. You do not have permissions for this market.' });
      return;
    }

    // Auto mark as READ if previously UNREAD
    if (item.status === 'UNREAD') {
      await prisma.contactInquiry.update({
        where: { id },
        data: { status: 'READ' },
      });
      item.status = 'READ';
    }

    res.json({
      success: true,
      data: {
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        handledAt: item.handledAt?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error('Fetch single inquiry error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inquiry details' });
  }
});

// PATCH /api/admin/inquiries/:id/status
router.patch('/:id/status', requirePermission('inquiries', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['UNREAD', 'READ', 'CONTACTED', 'RESOLVED'].includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid inquiry status' });
      return;
    }

    const existing = await prisma.contactInquiry.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Inquiry not found' });
      return;
    }

    if (!isUserAuthorizedForInquiry(req.user, existing)) {
      res.status(403).json({ success: false, error: 'Access denied. You do not have permissions for this market.' });
      return;
    }

    const updateData: Prisma.ContactInquiryUpdateInput = { status: status as InquiryStatus };
    if (status === 'CONTACTED' || status === 'RESOLVED') {
      updateData.handledBy = { connect: { id: req.user!.id } };
      updateData.handledAt = new Date();
    }

    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: updateData,
      include: {
        handledBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await logAudit({
      req,
      action: 'INQUIRY_STATUS_CHANGE',
      entityType: 'ContactInquiry',
      entityId: id,
      details: { previousStatus: existing.status, newStatus: status, handledBy: req.user!.email },
    });

    res.json({
      success: true,
      data: updated,
      message: `Inquiry status updated to ${status}`,
    });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
});

// PATCH /api/admin/inquiries/:id/notes
router.patch('/:id/notes', requirePermission('inquiries', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const existing = await prisma.contactInquiry.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Inquiry not found' });
      return;
    }

    if (!isUserAuthorizedForInquiry(req.user, existing)) {
      res.status(403).json({ success: false, error: 'Access denied. You do not have permissions for this market.' });
      return;
    }

    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: {
        adminNotes: typeof adminNotes === 'string' ? adminNotes : '',
        handledById: existing.handledById || req.user!.id,
      },
      include: {
        handledBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await logAudit({
      req,
      action: 'INQUIRY_NOTES_UPDATE',
      entityType: 'ContactInquiry',
      entityId: id,
      details: { inquiryEmail: existing.email, updatedBy: req.user!.email },
    });

    res.json({
      success: true,
      data: updated,
      message: 'Internal follow-up notes saved successfully',
    });
  } catch (error) {
    console.error('Update inquiry notes error:', error);
    res.status(500).json({ success: false, error: 'Failed to save notes' });
  }
});

// DELETE /api/admin/inquiries/:id
router.delete('/:id', requirePermission('inquiries', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.contactInquiry.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Inquiry not found' });
      return;
    }

    if (!isUserAuthorizedForInquiry(req.user, existing)) {
      res.status(403).json({ success: false, error: 'Access denied. You do not have permissions for this market.' });
      return;
    }

    await prisma.contactInquiry.delete({ where: { id } });

    await logAudit({
      req,
      action: 'DELETE_INQUIRY',
      entityType: 'ContactInquiry',
      entityId: id,
      details: { deletedEmail: existing.email, name: existing.fullName },
    });

    res.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete inquiry' });
  }
});

export default router;
