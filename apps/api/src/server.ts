import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { telemetryMiddleware } from './lib/telemetry';
import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public.routes';
import contentRoutes from './routes/content.routes';
import countriesRoutes from './routes/countries.routes';
import inquiryTypesRoutes from './routes/inquiry-types.routes';
import inquiriesRoutes from './routes/inquiries.routes';
import settingsRoutes from './routes/settings.routes';
import policiesRoutes from './routes/policies.routes';
import rolesRoutes from './routes/roles.routes';
import usersRoutes from './routes/users.routes';
import analyticsRoutes from './routes/analytics.routes';
import auditLogsRoutes from './routes/audit-logs.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Security & Parsing Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*', // In production, customize to specific frontend domains
    credentials: true,
  })
);
app.use(express.json());

// Public telemetry & threat monitoring
app.use(telemetryMiddleware);

// Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'avada-api',
    port: PORT,
  });
});

// Public Website Endpoints
app.use('/api/public', publicRoutes);
app.use('/api/contact', publicRoutes); // Alias for legacy/convenience
app.use('/api/auth', authRoutes);

// Protected Admin CMS Endpoints
app.use('/api/content', contentRoutes);
app.use('/api/admin/content', contentRoutes);
app.use('/api/admin/articles', contentRoutes);
app.use('/api/admin/countries', countriesRoutes);
app.use('/api/admin/inquiry-types', inquiryTypesRoutes);
app.use('/api/admin/inquiries', inquiriesRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin/policies', policiesRoutes);
app.use('/api/admin/roles', rolesRoutes);
app.use('/api/admin/users', usersRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/security', analyticsRoutes);
app.use('/api/admin/audit-logs', auditLogsRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Avada Enterprise API Server running on port ${PORT}`);
  console.log(`📡 Healthcheck available at: http://localhost:${PORT}/api/health`);
});

export default app;
