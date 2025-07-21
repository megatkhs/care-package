import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { customers } from './customer';

// 店舗オーナーユーザーテーブル（Google OAuth用）
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  googleId: text('google_id').unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  picture: text('picture'),
  role: varchar('role', { length: 20 }).notNull().default('store_owner'), // 'store_owner' のみ
  customerId: uuid('customer_id').references(() => customers.id),
  invitationId: uuid('invitation_id'), // 外部キー制約は index.ts で定義
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;