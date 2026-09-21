import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';

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

// Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'avada-api',
    port: PORT,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Avada API Server running on port ${PORT}`);
  console.log(`📡 Healthcheck available at: http://localhost:${PORT}/api/health`);
});

export default app;
