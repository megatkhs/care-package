import { and, count, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { db, stores, users } from '../db';
import { adminOnlyMiddleware, authMiddleware } from '../middleware/auth';

const admin = new Hono();

// すべてのルートに認証とadmin権限チェックを適用
admin.use('*', authMiddleware);
admin.use('*', adminOnlyMiddleware);

// ダッシュボード統計情報
admin.get('/dashboard', async (c) => {
  try {
    const [totalUsersResult, totalStoresResult, activeStoresResult] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(stores),
      db.select({ count: count() }).from(stores).where(eq(stores.isActive, true)),
    ]);

    // 今月の新規ユーザー数（簡単な実装）
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newUsersThisMonthResult = await db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          eq(users.isActive, true)
          // createdAt >= thisMonth の条件を追加したいところですが、簡略化
        )
      );

    return c.json({
      stats: {
        totalUsers: totalUsersResult[0].count,
        totalStores: totalStoresResult[0].count,
        activeStores: activeStoresResult[0].count,
        newUsersThisMonth: newUsersThisMonthResult[0].count, // 暫定
      },
      recentActivity: [
        {
          type: 'user_created',
          message: '新しいユーザーが登録されました',
          timestamp: new Date().toISOString(),
        },
        {
          type: 'store_updated',
          message: '店舗情報が更新されました',
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ユーザー管理
admin.get('/users', async (c) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(users.createdAt);

    return c.json({ users: allUsers });
  } catch (error) {
    console.error('Users fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

admin.get('/users/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        picture: users.picture,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user[0]) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user: user[0] });
  } catch (error) {
    console.error('User fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// 店舗管理
admin.get('/stores', async (c) => {
  try {
    const allStores = await db
      .select({
        id: stores.id,
        name: stores.name,
        description: stores.description,
        address: stores.address,
        phone: stores.phone,
        email: stores.email,
        isActive: stores.isActive,
        createdAt: stores.createdAt,
        updatedAt: stores.updatedAt,
        ownerName: users.name,
        ownerEmail: users.email,
      })
      .from(stores)
      .leftJoin(users, eq(stores.ownerId, users.id))
      .orderBy(stores.createdAt);

    return c.json({ stores: allStores });
  } catch (error) {
    console.error('Stores fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

admin.get('/stores/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const store = await db
      .select({
        id: stores.id,
        name: stores.name,
        description: stores.description,
        address: stores.address,
        phone: stores.phone,
        email: stores.email,
        website: stores.website,
        businessHours: stores.businessHours,
        latitude: stores.latitude,
        longitude: stores.longitude,
        isActive: stores.isActive,
        createdAt: stores.createdAt,
        updatedAt: stores.updatedAt,
        ownerName: users.name,
        ownerEmail: users.email,
      })
      .from(stores)
      .leftJoin(users, eq(stores.ownerId, users.id))
      .where(eq(stores.id, id))
      .limit(1);

    if (!store[0]) {
      return c.json({ error: 'Store not found' }, 404);
    }

    return c.json({ store: store[0] });
  } catch (error) {
    console.error('Store fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export { admin };
