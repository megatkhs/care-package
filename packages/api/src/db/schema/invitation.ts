import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { admins } from './admin';
import { customers } from './customer';
import { contracts } from './contract';
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