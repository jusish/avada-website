import { AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../prisma';

export interface AuditParams {
  req: AuthenticatedRequest;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
}

export async function logAudit({
  req,
  action,
  entityType,
  entityId,
  details,
}: AuditParams): Promise<void> {
  try {
    const user = req.user;
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await prisma.auditLog.create({
      data: {
        userId: user?.id,
        userEmail: user?.email || 'system@avada.com',
        action,
        entityType,
        entityId,
        details: details as object | undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
