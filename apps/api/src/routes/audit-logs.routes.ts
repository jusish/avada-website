import { Router, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/permission';

const router = Router();
router.use(requireAuth);

// GET /api/admin/audit-logs
router.get('/', requirePermission('audit_logs', 'view'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { action, entityType, search, limit = '100' } = req.query;

    const where: Prisma.AuditLogWhereInput = {};

    if (action && typeof action === 'string' && action !== 'all') {
      where.action = action;
    }
    if (entityType && typeof entityType === 'string' && entityType !== 'all') {
      where.entityType = entityType;
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { userEmail: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } },
        { entityType: { contains: search, mode: 'insensitive' } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(parseInt(limit as string, 10) || 100, 200),
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json({
      success: true,
      data: logs.map((l) => ({
        id: l.id,
        userId: l.userId,
        userEmail: l.userEmail,
        action: l.action,
        entityType: l.entityType,
        entityId: l.entityId,
        details: l.details,
        ipAddress: l.ipAddress,
        userAgent: l.userAgent,
        user: l.user,
        createdAt: l.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Fetch audit logs error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
  }
});

export default router;
