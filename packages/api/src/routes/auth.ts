import { compare, hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { sign, verify } from 'jsonwebtoken';
import { admins, db, users } from '../db';
import type { AuthPayload } from '../middleware/auth';

const auth = new Hono();

const jwtSecret = process.env.JWT_SECRET!;

// 管理者ログイン
auth.post('/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400);
    }

    // 管理者を検索
    const admin = await db.select().from(admins).where(eq(admins.username, username)).limit(1);

    if (!admin[0]) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    if (!admin[0].isActive) {
      return c.json({ error: 'Account is deactivated' }, 403);
    }

    // パスワード確認
    const isValidPassword = await compare(password, admin[0].passwordHash);
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // JWT作成
    const payload: AuthPayload = {
      userId: admin[0].id,
      email: admin[0].email,
      role: 'admin',
      userType: 'admin',
    };

    const token = sign(payload, jwtSecret, { expiresIn: '7d' });

    return c.json({
      token,
      user: {
        id: admin[0].id,
        username: admin[0].username,
        email: admin[0].email,
        name: admin[0].name,
        role: 'admin',
        userType: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// 管理者用の現在のユーザー情報取得
auth.get('/admin/me', async (c) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = verify(token, jwtSecret) as AuthPayload;

    if (payload.userType !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const admin = await db
      .select({
        id: admins.id,
        username: admins.username,
        email: admins.email,
        name: admins.name,
        isActive: admins.isActive,
        createdAt: admins.createdAt,
      })
      .from(admins)
      .where(eq(admins.id, payload.userId))
      .limit(1);

    if (!admin[0] || !admin[0].isActive) {
      return c.json({ error: 'Invalid or inactive admin' }, 401);
    }

    return c.json({
      user: {
        ...admin[0],
        role: 'admin',
        userType: 'admin',
      },
    });
  } catch (error) {
    console.error('JWT verification error:', error);
    return c.json({ error: 'Invalid token' }, 401);
  }
});

// ログアウト
auth.post('/logout', async (c) => {
  // クライアント側でトークンを削除するため、サーバー側では特に処理なし
  return c.json({ message: 'Logged out successfully' });
});

// 開発用: 管理者アカウント作成エンドポイント
auth.post('/admin/create', async (c) => {
  // 本番環境では削除または無効化する
  if (process.env.NODE_ENV === 'production') {
    return c.json({ error: 'Not available in production' }, 403);
  }

  try {
    const { username, email, password, name } = await c.req.json();

    if (!username || !email || !password || !name) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    // 既存ユーザーチェック
    const existingAdmin = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);

    if (existingAdmin[0]) {
      return c.json({ error: 'Username already exists' }, 409);
    }

    // パスワードハッシュ化
    const passwordHash = await hash(password, 12);

    // 管理者作成
    const newAdmin = await db
      .insert(admins)
      .values({
        username,
        email,
        passwordHash,
        name,
      })
      .returning({
        id: admins.id,
        username: admins.username,
        email: admins.email,
        name: admins.name,
      });

    return c.json({
      message: 'Admin created successfully',
      admin: newAdmin[0],
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export { auth };
