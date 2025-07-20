import { Hono } from 'hono';
import { googleAuth } from '@hono/oauth-providers/google';
import { sign } from 'jsonwebtoken';
import { db, users } from '../db';
import { eq } from 'drizzle-orm';
import type { AuthPayload } from '../middleware/auth';

const auth = new Hono();

// Google OAuth設定
const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const jwtSecret = process.env.JWT_SECRET!;

// Google OAuth開始
auth.get('/google', googleAuth({
  client_id: googleClientId,
  client_secret: googleClientSecret,
  scope: ['email', 'profile']
}));

// Google OAuthコールバック
auth.get('/google/callback', googleAuth({
  client_id: googleClientId,
  client_secret: googleClientSecret,
  scope: ['email', 'profile']
}), async (c) => {
  const user = c.get('user-google');
  
  if (!user) {
    return c.json({ error: 'Authentication failed' }, 400);
  }

  try {
    // ユーザー情報を取得または作成
    let dbUser = await db
      .select()
      .from(users)
      .where(eq(users.googleId, user.id))
      .limit(1);

    if (!dbUser[0]) {
      // 新規ユーザー作成
      const insertResult = await db
        .insert(users)
        .values({
          googleId: user.id,
          email: user.email,
          name: user.name || 'Unknown',
          picture: user.picture,
          role: 'store_owner', // デフォルトは店舗オーナー
        })
        .returning();
      
      dbUser = insertResult;
    } else {
      // 既存ユーザーの情報更新
      const updateResult = await db
        .update(users)
        .set({
          name: user.name || dbUser[0].name,
          picture: user.picture,
          updatedAt: new Date(),
        })
        .where(eq(users.id, dbUser[0].id))
        .returning();
      
      dbUser = updateResult;
    }

    if (!dbUser[0].isActive) {
      return c.json({ error: 'Account is deactivated' }, 403);
    }

    // JWT作成
    const payload: AuthPayload = {
      userId: dbUser[0].id,
      email: dbUser[0].email,
      role: dbUser[0].role,
    };

    const token = sign(payload, jwtSecret, { expiresIn: '7d' });

    // フロントエンドにリダイレクト（トークンを含む）
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`;
    
    return c.redirect(redirectUrl);
  } catch (error) {
    console.error('Auth callback error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ログアウト
auth.post('/logout', async (c) => {
  // クライアント側でトークンを削除するため、サーバー側では特に処理なし
  return c.json({ message: 'Logged out successfully' });
});

// 現在のユーザー情報を取得
auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const { verify } = await import('jsonwebtoken');
    const payload = verify(token, jwtSecret) as AuthPayload;
    
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        picture: users.picture,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user[0] || !user[0].isActive) {
      return c.json({ error: 'Invalid or inactive user' }, 401);
    }

    return c.json({ user: user[0] });
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

export { auth };