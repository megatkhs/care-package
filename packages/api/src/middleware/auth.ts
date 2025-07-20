import { MiddlewareHandler } from 'hono';
import { verify } from 'jsonwebtoken';
import { db, users } from '../db';
import { eq } from 'drizzle-orm';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
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
    
    // ユーザーが存在し、アクティブかチェック
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user[0] || !user[0].isActive) {
      return c.json({ error: 'Invalid or inactive user' }, 401);
    }

    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

export const adminOnlyMiddleware: MiddlewareHandler = async (c, next) => {
  const user = c.get('user');
  
  if (user.role !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403);
  }
  
  await next();
};