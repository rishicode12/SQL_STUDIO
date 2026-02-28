-- ==============================================
-- CipherSQLStudio - PostgreSQL Sandbox Seed
-- Run this to set up sample assignment schemas
-- ==============================================

-- Assignment 1: Basic SELECT (schema: assignment_1)
CREATE SCHEMA IF NOT EXISTS assignment_1;

CREATE TABLE IF NOT EXISTS assignment_1.employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(50),
  salary NUMERIC(10,2),
  hire_date DATE
);

INSERT INTO assignment_1.employees (name, department, salary, hire_date) VALUES
  ('Alice Johnson', 'Engineering', 95000, '2020-03-15'),
  ('Bob Smith', 'Marketing', 72000, '2019-07-22'),
  ('Carol White', 'Engineering', 105000, '2018-01-10'),
  ('David Brown', 'HR', 65000, '2021-05-30'),
  ('Eva Green', 'Engineering', 88000, '2020-11-01'),
  ('Frank Lee', 'Marketing', 78000, '2017-09-14'),
  ('Grace Kim', 'HR', 70000, '2022-02-28'),
  ('Henry Park', 'Engineering', 112000, '2016-06-05');

-- Assignment 2: JOINs (schema: assignment_2)
CREATE SCHEMA IF NOT EXISTS assignment_2;

CREATE TABLE IF NOT EXISTS assignment_2.orders (
  id SERIAL PRIMARY KEY,
  customer_id INT,
  product VARCHAR(100),
  amount NUMERIC(10,2),
  order_date DATE
);

CREATE TABLE IF NOT EXISTS assignment_2.customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  city VARCHAR(50),
  email VARCHAR(100)
);

INSERT INTO assignment_2.customers (name, city, email) VALUES
  ('Acme Corp', 'New York', 'contact@acme.com'),
  ('Beta Inc', 'Chicago', 'info@beta.com'),
  ('Gamma LLC', 'San Francisco', 'hello@gamma.com'),
  ('Delta Co', 'Austin', 'support@delta.com');

INSERT INTO assignment_2.orders (customer_id, product, amount, order_date) VALUES
  (1, 'Laptop', 1200.00, '2024-01-10'),
  (1, 'Mouse', 45.00, '2024-01-15'),
  (2, 'Monitor', 350.00, '2024-02-01'),
  (3, 'Keyboard', 120.00, '2024-02-10'),
  (3, 'Laptop', 1200.00, '2024-02-15'),
  (4, 'Webcam', 89.00, '2024-03-01');

-- Assignment 3: Aggregations (schema: assignment_3)
CREATE SCHEMA IF NOT EXISTS assignment_3;

CREATE TABLE IF NOT EXISTS assignment_3.sales (
  id SERIAL PRIMARY KEY,
  salesperson VARCHAR(100),
  region VARCHAR(50),
  product_category VARCHAR(50),
  revenue NUMERIC(12,2),
  sale_date DATE
);

INSERT INTO assignment_3.sales (salesperson, region, product_category, revenue, sale_date) VALUES
  ('Alice', 'North', 'Electronics', 5200.00, '2024-01-05'),
  ('Bob', 'South', 'Furniture', 3100.00, '2024-01-12'),
  ('Alice', 'North', 'Electronics', 4800.00, '2024-02-01'),
  ('Carol', 'East', 'Electronics', 7200.00, '2024-02-14'),
  ('Bob', 'South', 'Electronics', 2900.00, '2024-02-20'),
  ('Carol', 'East', 'Furniture', 1800.00, '2024-03-01'),
  ('Alice', 'North', 'Furniture', 2200.00, '2024-03-10'),
  ('David', 'West', 'Electronics', 6100.00, '2024-03-15');


