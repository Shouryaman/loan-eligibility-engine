CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  monthly_income NUMERIC,
  credit_score INTEGER,
  employment_status TEXT,
  age INTEGER,
  raw JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- LOAN PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS loan_products (
  product_id SERIAL PRIMARY KEY,
  product_name TEXT,
  interest_rate NUMERIC,
  min_monthly_income NUMERIC,
  min_credit_score INTEGER,
  employment_required BOOLEAN,
  product_url TEXT,
  raw JSONB,
  discovered_at TIMESTAMP DEFAULT now()
);

-- MATCHES TABLE
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id),
  product_id INTEGER REFERENCES loan_products(product_id),
  match_score NUMERIC,
  reasons JSONB,
  created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE loan_products ADD COLUMN bank_name TEXT;
