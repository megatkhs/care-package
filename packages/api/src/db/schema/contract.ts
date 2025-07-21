import { date, decimal, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { customers } from './customer';

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

export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;