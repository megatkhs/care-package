import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { admin } from './routes/admin';
import { auth } from './routes/auth';

// 環境変数を読み込み
config();

const app = new Hono();

// ミドルウェア設定
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  })
);

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'care-package-api',
  });
});

// API ルート
app.get('/api', (c) => {
  return c.json({
    message: 'Care Package API Server',
    version: '1.0.0',
  });
});

// API ルート
app.route('/api/auth', auth);
app.route('/api/admin', admin);

const port = Number(process.env.PORT) || 8000;

console.log(`🚀 Care Package API Server starting on port ${port}`);
serve({
  fetch: app.fetch,
  port,
});

export default app;
