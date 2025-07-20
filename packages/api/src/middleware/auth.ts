import { eq } from 'drizzle-orm';
import type { MiddlewareHandler } from 'hono';
import { verify } from 'jsonwebtoken';
import { admins, db, users } from '../db';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  userType: 'admin' | 'user'; // 管理者かユーザーかを区別
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthPayload;
  }
}

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not set');
  }

  try {
    const payload = verify(token, jwtSecret) as AuthPayload;

    // ユーザータイプに応じて存在確認
    if (payload.userType === 'admin') {
      const admin = await db.select().from(admins).where(eq(admins.id, payload.userId)).limit(1);

      if (!admin[0] || !admin[0].isActive) {
        return c.json({ error: 'Invalid or inactive admin' }, 401);
      }
    } else {
      const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);

      if (!user[0] || !user[0].isActive) {
        return c.json({ error: 'Invalid or inactive user' }, 401);
      }
    }

    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

export const adminOnlyMiddleware: MiddlewareHandler = async (c, next) => {
  const user = c.get('user');

  if (user.userType !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403);
  }

  await next();
};
