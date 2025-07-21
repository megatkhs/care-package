import { boolean, date, decimal, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// 管理者テーブル（ID/PWログイン用）
export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 契約者テーブル
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 契約管理テーブル
export const contracts = pgTable('contracts', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .references(() => customers.id)
    .notNull(),
  planId: varchar('plan_id', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, active, suspended, cancelled
  monthlyFee: decimal('monthly_fee', { precision: 10, scale: 2 }).notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 招待管理テーブル
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

// 店舗オーナーユーザーテーブル（Google OAuth用）
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  googleId: text('google_id').unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  picture: text('picture'),
  role: varchar('role', { length: 20 }).notNull().default('store_owner'), // 'store_owner' のみ
  customerId: uuid('customer_id').references(() => customers.id),
  invitationId: uuid('invitation_id').references(() => invitations.id),
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const stores = pgTable('stores', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .references(() => customers.id)
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  website: text('website'),
  category: varchar('category', { length: 50 }),
  businessHours: jsonb('business_hours'), // JSONB for flexible business hours management
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
