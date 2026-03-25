import { pgTable, text, timestamp, integer, boolean, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  credits: integer('credits').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const apiKeys = pgTable('api_keys', {
  key: text('key').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  label: text('label'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at'),
  isRevoked: boolean('is_revoked').default(false).notNull(),
});

export const creditTransactions = pgTable('credit_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  amount: integer('amount').notNull(),
  type: text('type').notNull(), // 'purchase', 'deduction', 'refund'
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const requestLogs = pgTable('request_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiKey: text('api_key').references(() => apiKeys.key),
  endpoint: text('endpoint').notNull(),
  method: text('method').notNull(),
  status: integer('status').notNull(),
  latency: integer('latency').notNull(),
  ip: text('ip'),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const parseLogs = pgTable('parse_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  replayId: text('replay_id').notNull(),
  status: text('status').notNull(), // 'pending', 'processed', 'failed'
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
