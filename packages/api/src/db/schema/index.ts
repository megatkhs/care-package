// 全てのスキーマを統合・エクスポート
// 順序を考慮してインポート・エクスポート

// 基本テーブル（依存関係なし）
export * from './admin';

// 顧客関連（adminを参照）
export { customers, contracts } from './customer';
export type { Customer, NewCustomer, Contract, NewContract } from './customer';

// 店舗テーブル（customerを参照）
export * from './store';

// 招待テーブル（admin, customer, store, contractを参照）
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { admins } from './admin';
import { customers, contracts } from './customer';
import { stores } from './store';

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .references(() => customers.id)
    .notNull(),
  storeId: uuid('store_id').references(() => stores.id),
  contractId: uuid('contract_id').references(() => contracts.id),
  invitationToken: varchar('invitation_token', { length: 255 }).unique().notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, sent, accepted, expired, cancelled
  expiresAt: timestamp('expires_at').notNull(),
  invitedBy: uuid('invited_by')
    .references(() => admins.id)
    .notNull(),
  invitedAt: timestamp('invited_at').defaultNow().notNull(),
  acceptedAt: timestamp('accepted_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

// ユーザーテーブル（customer, invitationを参照）
import { users } from './user';
export { users } from './user';
export type { User, NewUser } from './user';

// usersテーブルの外部キー制約を後から追加（循環参照回避）
import { foreignKey } from 'drizzle-orm/pg-core';

export const userInvitationFK = foreignKey({
  columns: [users.invitationId],
  foreignColumns: [invitations.id],
});