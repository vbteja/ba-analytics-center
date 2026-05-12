import { pgTable, uuid, text, integer, numeric, date, timestamp } from 'drizzle-orm/pg-core'

// Customer Churn
export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  segment: text('segment'),
  tenure_months: integer('tenure_months'),
  monthly_spend: numeric('monthly_spend'),
  support_tickets: integer('support_tickets'),
  last_login_days: integer('last_login_days'),
  churn_risk: text('churn_risk'),
  churned: text('churned').default('false'),
  churn_reason: text('churn_reason'),
  created_at: timestamp('created_at').defaultNow(),
})

// Marketing Campaigns
export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  channel: text('channel'),
  budget: numeric('budget'),
  spend: numeric('spend'),
  impressions: integer('impressions'),
  clicks: integer('clicks'),
  conversions: integer('conversions'),
  revenue: numeric('revenue'),
  start_date: date('start_date'),
  end_date: date('end_date'),
  status: text('status'),
  created_at: timestamp('created_at').defaultNow(),
})

// Supply Chain
export const suppliers = pgTable('suppliers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category: text('category'),
  country: text('country'),
  on_time_delivery: numeric('on_time_delivery'),
  quality_score: numeric('quality_score'),
  avg_lead_days: integer('avg_lead_days'),
  cost_variance: numeric('cost_variance'),
  defect_rate: numeric('defect_rate'),
  status: text('status'),
  created_at: timestamp('created_at').defaultNow(),
})

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  supplier_id: uuid('supplier_id').references(() => suppliers.id),
  product: text('product'),
  quantity: integer('quantity'),
  ordered_date: date('ordered_date'),
  expected_date: date('expected_date'),
  actual_date: date('actual_date'),
  status: text('status'),
  value: numeric('value'),
  created_at: timestamp('created_at').defaultNow(),
})

// Financial Forecasting
export const financials = pgTable('financials', {
  id: uuid('id').defaultRandom().primaryKey(),
  month: text('month').notNull(),
  year: integer('year'),
  revenue_actual: numeric('revenue_actual'),
  revenue_forecast: numeric('revenue_forecast'),
  expenses_actual: numeric('expenses_actual'),
  expenses_forecast: numeric('expenses_forecast'),
  profit_actual: numeric('profit_actual'),
  profit_forecast: numeric('profit_forecast'),
  created_at: timestamp('created_at').defaultNow(),
})