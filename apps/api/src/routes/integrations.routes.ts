import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/permission';
import { logAudit } from '../lib/audit';
import { PeopleForceService } from '../services/peopleforce.service';
import { IntegrationLogger } from '../services/integration-logger';

const router = Router();
router.use(requireAuth);

/**
 * GET /api/admin/integrations
 * Lists all registered and planned third-party integrations
 */
router.get(
  '/',
  requirePermission('integrations', 'view'),
  async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const dbIntegrations = await prisma.integration.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
          _count: {
            select: { logs: true },
          },
        },
      });

      // Include vacancy stats for PeopleForce
      const totalVacancies = await prisma.jobVacancy.count({ where: { active: true } });

      const integrationsWithStats = dbIntegrations.map((item) => {
        const rawConfig = (item.config as Record<string, unknown>) || {};
        const maskedKey =
          typeof rawConfig.apiKey === 'string' && rawConfig.apiKey.length > 8
            ? `${rawConfig.apiKey.slice(0, 4)}••••••••${rawConfig.apiKey.slice(-4)}`
            : rawConfig.apiKey
              ? '••••••••'
              : '';

        return {
          ...item,
          config: {
            ...rawConfig,
            apiKeyMasked: maskedKey,
          },
          stats: {
            totalLogs: item._count.logs,
            activeVacancies: item.key === 'peopleforce' ? totalVacancies : 0,
          },
        };
      });

      // Planned future integrations to showcase extensible architecture
      const plannedIntegrations = [
        {
          key: 'mailgun_smtp',
          name: 'Mailgun & SMTP Email Gateway',
          category: 'Transactional Communications',
          description: 'High-deliverability transactional customer emails, notification receipts, and automated alerts.',
          status: 'DISCONNECTED',
          enabled: false,
          isPlanned: true,
        },
        {
          key: 'slack_webhooks',
          name: 'Slack Notification Alerts',
          category: 'Real-Time Telemetry',
          description: 'Stream customer inquiries, high-priority partner leads, and security threat alerts into Slack.',
          status: 'DISCONNECTED',
          enabled: false,
          isPlanned: true,
        },
        {
          key: 'hubspot_crm',
          name: 'HubSpot Enterprise CRM',
          category: 'Lead & Contact Sync',
          description: 'Automatically bidirectional-sync merchant leads and corporate inquiries with HubSpot CRM.',
          status: 'DISCONNECTED',
          enabled: false,
          isPlanned: true,
        },
      ];

      res.json({
        success: true,
        data: {
          active: integrationsWithStats,
          planned: plannedIntegrations,
        },
      });
    } catch (err) {
      console.error('List integrations error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve integrations list.' });
    }
  }
);

/**
 * GET /api/admin/integrations/:key
 * Retrieves detailed settings, metrics, and health for a specific integration
 */
router.get(
  '/:key',
  requirePermission('integrations', 'view'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { key } = req.params;
      const integration = await prisma.integration.findUnique({
        where: { key },
        include: {
          _count: {
            select: { logs: true },
          },
        },
      });

      if (!integration) {
        res.status(404).json({ success: false, error: `Integration "${key}" not found.` });
        return;
      }

      const totalVacancies = await prisma.jobVacancy.count({ where: { active: true } });
      const recentLogs = await prisma.integrationLog.findMany({
        where: { integrationKey: key },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      res.json({
        success: true,
        data: {
          ...integration,
          stats: {
            totalLogs: integration._count.logs,
            activeVacancies: key === 'peopleforce' ? totalVacancies : 0,
          },
          recentLogs,
        },
      });
    } catch (err) {
      console.error('Get integration error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve integration details.' });
    }
  }
);

/**
 * PUT /api/admin/integrations/:key/config
 * Updates configuration settings (API Key, Base URL, auto-sync)
 */
router.put(
  '/:key/config',
  requirePermission('integrations', 'edit'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { key } = req.params;
      const { apiKey, baseUrl, autoSync, syncIntervalMinutes, enabled } = req.body;

      const existing = await prisma.integration.findUnique({ where: { key } });
      if (!existing) {
        res.status(404).json({ success: false, error: `Integration "${key}" not found.` });
        return;
      }

      const prevConfig = (existing.config as Record<string, unknown>) || {};
      const newConfig: Record<string, unknown> = {
        ...prevConfig,
      };

      if (apiKey !== undefined && apiKey.trim() !== '') {
        newConfig.apiKey = apiKey.trim();
      }
      if (baseUrl !== undefined) {
        newConfig.baseUrl = baseUrl.trim();
      }
      if (autoSync !== undefined) {
        newConfig.autoSync = Boolean(autoSync);
      }
      if (syncIntervalMinutes !== undefined) {
        newConfig.syncIntervalMinutes = Number(syncIntervalMinutes);
      }

      const updated = await prisma.integration.update({
        where: { key },
        data: {
          enabled: enabled !== undefined ? Boolean(enabled) : existing.enabled,
          config: newConfig as object,
        },
      });

      await logAudit({
        req,
        action: 'UPDATE_INTEGRATION_CONFIG',
        entityType: 'Integration',
        entityId: key,
        details: {
          key,
          updatedFields: Object.keys(req.body),
        },
      });

      res.json({
        success: true,
        data: updated,
        message: `${existing.name} configuration updated successfully.`,
      });
    } catch (err) {
      console.error('Update integration config error:', err);
      res.status(500).json({ success: false, error: 'Failed to update integration configuration.' });
    }
  }
);

/**
 * POST /api/admin/integrations/:key/health
 * Executes an on-demand live health check & latency test
 */
router.post(
  '/:key/health',
  requirePermission('integrations', 'view'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { key } = req.params;

      if (key === 'peopleforce') {
        const result = await PeopleForceService.testHealth();
        res.json({
          success: result.healthy,
          data: result,
          message: result.message,
        });
        return;
      }

      res.status(400).json({ success: false, error: `Health check not implemented for integration "${key}".` });
    } catch (err) {
      console.error('Integration health test error:', err);
      res.status(500).json({ success: false, error: 'Failed to execute health check.' });
    }
  }
);

/**
 * POST /api/admin/integrations/:key/sync
 * Triggers an immediate vacancy synchronization
 */
router.post(
  '/:key/sync',
  requirePermission('integrations', 'edit'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { key } = req.params;

      if (key === 'peopleforce') {
        const syncResult = await PeopleForceService.syncVacancies();

        await logAudit({
          req,
          action: 'SYNC_PEOPLEFORCE_VACANCIES',
          entityType: 'Integration',
          entityId: key,
          details: syncResult,
        });

        res.json({
          success: true,
          data: syncResult,
          message: `Successfully synchronized ${syncResult.syncedCount} vacancies from PeopleForce.`,
        });
        return;
      }

      res.status(400).json({ success: false, error: `Sync not supported for integration "${key}".` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync failed';
      console.error('Sync error:', err);
      res.status(500).json({ success: false, error: msg });
    }
  }
);

/**
 * GET /api/admin/integrations/:key/logs
 * Retrieves paginated integration audit logs with status filter and search
 */
router.get(
  '/:key/logs',
  requirePermission('integrations', 'view'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { key } = req.params;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const status = req.query.status as string;
      const search = req.query.search as string;

      const result = await IntegrationLogger.getLogs(key, { page, limit, status, search });

      res.json({
        success: true,
        data: result.logs,
        pagination: result.pagination,
      });
    } catch (err) {
      console.error('Fetch integration logs error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve integration logs.' });
    }
  }
);

/**
 * GET /api/admin/integrations/:key/logs/:id
 * Retrieves full request/response payload details for a single log entry
 */
router.get(
  '/:key/logs/:id',
  requirePermission('integrations', 'view'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const log = await IntegrationLogger.getLogById(id);

      if (!log) {
        res.status(404).json({ success: false, error: 'Log entry not found.' });
        return;
      }

      res.json({
        success: true,
        data: log,
      });
    } catch (err) {
      console.error('Fetch log detail error:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve log details.' });
    }
  }
);

/**
 * DELETE /api/admin/integrations/:key/logs
 * Clears old integration logs
 */
router.delete(
  '/:key/logs',
  requirePermission('integrations', 'edit'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { key } = req.params;
      const result = await IntegrationLogger.clearLogs(key);

      await logAudit({
        req,
        action: 'CLEAR_INTEGRATION_LOGS',
        entityType: 'Integration',
        entityId: key,
        details: { count: result.count },
      });

      res.json({
        success: true,
        data: { clearedCount: result.count },
        message: `Cleared ${result.count} logs for ${key}.`,
      });
    } catch (err) {
      console.error('Clear logs error:', err);
      res.status(500).json({ success: false, error: 'Failed to clear integration logs.' });
    }
  }
);

export default router;
