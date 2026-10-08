import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

export const telemetryMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', async () => {
    // Only track public API calls and page accesses, skip asset requests
    if (req.path.startsWith('/api/health') || req.path.startsWith('/api/admin/analytics')) {
      return;
    }

    const responseTime = Date.now() - start;
    const userAgent = req.headers['user-agent'] || '';
    const queryStr = JSON.stringify(req.query || {});
    const bodyStr = JSON.stringify(req.body || {});

    // Anomaly detection rules
    let isSuspicious = false;
    let flagReason: string | null = null;

    // 1. SQL Injection / Script payload check
    const suspiciousPatterns = [
      /union\s+select/i,
      /<script.*?>/i,
      /(%27)|(')|(--)|(%23)|(#)/i,
      /etc\/passwd/i,
      /\/wp-admin/i,
      /\/phpmyadmin/i,
    ];

    const targetUrl = req.originalUrl || req.url;
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(targetUrl) || pattern.test(queryStr) || pattern.test(bodyStr)) {
        isSuspicious = true;
        flagReason = 'Malicious payload pattern or automated probe detected';
        break;
      }
    }

    // 2. Headless crawler or scraping tool
    if (!isSuspicious && /sqlmap|nikto|curl\/|python-requests|nmap|zgrab/i.test(userAgent)) {
      isSuspicious = true;
      flagReason = 'Automated vulnerability scanner or scraping client';
    }

    // Capture country from Cloudflare / proxy headers or fallback
    const country =
      (req.headers['cf-ipcountry'] as string) ||
      (req.headers['x-country-code'] as string) ||
      (req.path.includes('rwanda') ? 'Rwanda' : req.path.includes('kenya') ? 'Kenya' : req.path.includes('tanzania') ? 'Tanzania' : 'East Africa');

    try {
      await prisma.siteTelemetry.create({
        data: {
          path: req.originalUrl || req.path,
          country,
          referrer: (req.headers['referer'] as string) || null,
          isSuspicious,
          flagReason,
          responseTime,
          statusCode: res.statusCode,
        },
      });
    } catch {
      // Telemetry should never crash the request flow
    }
  });

  next();
};
