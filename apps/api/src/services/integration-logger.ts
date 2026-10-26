import { prisma } from '../prisma';

export interface LogCallParams {
  integrationKey: string;
  integrationId?: string;
  method: string;
  endpoint: string;
  url: string;
  requestHeaders?: Record<string, unknown> | null;
  requestPayload?: unknown;
  responseStatus: number;
  responsePayload?: unknown;
  durationMs: number;
  status?: 'SUCCESS' | 'ERROR';
  errorMessage?: string | null;
}

/**
 * Masks sensitive header values such as API keys, Bearer tokens, passwords
 */
export function sanitizeHeaders(headers?: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!headers) return null;
  const sanitized: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('key') ||
      lowerKey.includes('token') ||
      lowerKey.includes('auth') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('password')
    ) {
      if (typeof val === 'string' && val.length > 8) {
        sanitized[key] = `${val.slice(0, 4)}...${val.slice(-4)}`;
      } else {
        sanitized[key] = '********';
      }
    } else {
      sanitized[key] = val;
    }
  }

  return sanitized;
}

/**
 * Truncates very large JSON payloads to prevent database bloat
 */
export function safePayload(payload: unknown, maxChars = 50000): unknown {
  if (payload === undefined || payload === null) return null;
  try {
    const str = JSON.stringify(payload);
    if (str.length <= maxChars) return payload;
    return {
      _truncated: true,
      originalLength: str.length,
      preview: JSON.parse(str.slice(0, maxChars) + '"}'),
    };
  } catch {
    return payload;
  }
}

/**
 * Integration Logger Service
 * Captures all outgoing requests and responses across external integrations.
 */
export class IntegrationLogger {
  /**
   * Log an outgoing integration call
   */
  static async logCall(params: LogCallParams) {
    try {
      const sanitizedHeaders = sanitizeHeaders(params.requestHeaders);
      const safeRequest = safePayload(params.requestPayload);
      const safeResponse = safePayload(params.responsePayload);

      const status =
        params.status || (params.responseStatus >= 200 && params.responseStatus < 300 ? 'SUCCESS' : 'ERROR');

      return await prisma.integrationLog.create({
        data: {
          integrationKey: params.integrationKey,
          integrationId: params.integrationId,
          method: params.method.toUpperCase(),
          endpoint: params.endpoint,
          url: params.url,
          requestHeaders: (sanitizedHeaders as object) || undefined,
          requestPayload: (safeRequest as object) || undefined,
          responseStatus: params.responseStatus,
          responsePayload: (safeResponse as object) || undefined,
          durationMs: params.durationMs,
          status,
          errorMessage: params.errorMessage || null,
        },
      });
    } catch (err) {
      console.error(`[IntegrationLogger] Failed to write log for ${params.integrationKey}:`, err);
      return null;
    }
  }

  /**
   * Retrieve paginated logs for a specific integration
   */
  static async getLogs(
    integrationKey: string,
    options: { page?: number; limit?: number; status?: string; search?: string } = {}
  ) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { integrationKey };

    if (options.status && options.status !== 'ALL') {
      where.status = options.status;
    }

    if (options.search && options.search.trim()) {
      where.OR = [
        { endpoint: { contains: options.search.trim(), mode: 'insensitive' } },
        { url: { contains: options.search.trim(), mode: 'insensitive' } },
        { errorMessage: { contains: options.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [total, logs] = await Promise.all([
      prisma.integrationLog.count({ where }),
      prisma.integrationLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single log by ID
   */
  static async getLogById(id: string) {
    return prisma.integrationLog.findUnique({
      where: { id },
      include: {
        integration: {
          select: { name: true, key: true, category: true },
        },
      },
    });
  }

  /**
   * Clear old logs for an integration
   */
  static async clearLogs(integrationKey: string) {
    return prisma.integrationLog.deleteMany({
      where: { integrationKey },
    });
  }
}
