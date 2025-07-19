import { Hono } from 'hono';
import { createSuccessResponse } from '@care-package/shared';

const admin = new Hono();

// ダッシュボード情報取得
admin.get('/dashboard', (c) => {
  const dashboardData = {
    totalUsers: 42,
    totalStores: 18,
    activeStores: 15,
    monthlyRevenue: 125000,
  };
  
  return c.json(createSuccessResponse(dashboardData));
});

// ユーザー一覧取得
admin.get('/users', (c) => {
  const users = [
    {
      id: '1',
      email: 'store1@example.com',
      name: '田中商店',
      role: 'store_owner',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    }
  ];
  
  return c.json(createSuccessResponse(users));
});

// 店舗一覧取得
admin.get('/stores', (c) => {
  const stores = [
    {
      id: '1',
      name: '田中商店',
      description: '地元密着の小さな商店です',
      ownerId: '1',
      status: 'active',
      address: {
        prefecture: '東京都',
        city: '渋谷区',
        street: '神南1-1-1',
        zipCode: '150-0041',
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    }
  ];
  
  return c.json(createSuccessResponse(stores));
});

export { admin };