import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/permission';
import { logAudit } from '../lib/audit';

const router = Router();
router.use(requireAuth);

// GET /api/admin/settings
router.get('/', requirePermission('settings', 'view'), async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, unknown> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    res.json({
      success: true,
      data: settingsMap,
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch site settings' });
  }
});

// PUT /api/admin/settings/:key
router.put('/:key', requirePermission('settings', 'edit'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;

    if (!value || typeof value !== 'object') {
      res.status(400).json({ success: false, error: 'Setting value must be a valid JSON object' });
      return;
    }

    const existing = await prisma.siteSetting.findUnique({ where: { key } });

    const updated = await prisma.siteSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description: description || '' },
    });

    await logAudit({
      req,
      action: 'UPDATE_SITE_SETTING',
      entityType: 'SiteSetting',
      entityId: key,
      details: { key, before: existing?.value, after: value },
    });

    res.json({
      success: true,
      data: updated,
      message: `Setting ${key} updated successfully`,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to update setting' });
  }
});

export default router;
