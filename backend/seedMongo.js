require('dotenv').config();
const mongoose = require('mongoose');
const Assignment = require('./models/Assignment');

// --- SCHEMA TEMPLATES (Used to show tables & sample rows on the Frontend) ---

const employeeSchema = [{
    tableName: 'employees',
    columns: [
        { name: 'id', type: 'SERIAL', constraints: 'PRIMARY KEY' },
        { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL' },
        { name: 'department', type: 'VARCHAR(50)', constraints: '' },
        { name: 'salary', type: 'NUMERIC(10,2)', constraints: '' },
        { name: 'hire_date', type: 'DATE', constraints: '' }
    ],
    sampleData: [
        ['1', 'Alice Johnson', 'Engineering', '95000', '2020-03-15'],
        ['2', 'Bob Smith', 'Marketing', '72000', '2019-07-22'],
        ['3', 'Carol White', 'Engineering', '105000', '2018-01-10']
    ]
}];

const orderCustomerSchema = [
    {
        tableName: 'customers',
        columns: [
            { name: 'id', type: 'SERIAL', constraints: 'PRIMARY KEY' },
            { name: 'name', type: 'VARCHAR(100)', constraints: '' },
            { name: 'city', type: 'VARCHAR(50)', constraints: '' }
        ],
        sampleData: [
            ['1', 'Acme Corp', 'New York'],
            ['2', 'Beta Inc', 'Chicago']
        ]
    },
    {
        tableName: 'orders',
        columns: [
            { name: 'id', type: 'SERIAL', constraints: 'PRIMARY KEY' },
            { name: 'customer_id', type: 'INT', constraints: 'FK' },
            { name: 'product', type: 'VARCHAR(100)', constraints: '' },
            { name: 'amount', type: 'NUMERIC(10,2)', constraints: '' }
        ],
        sampleData: [
            ['1', '1', 'Laptop', '1200.00'],
            ['2', '1', 'Mouse', '45.00']
        ]
    }
];

const salesSchema = [{
    tableName: 'sales',
    columns: [
        { name: 'id', type: 'SERIAL', constraints: 'PRIMARY KEY' },
        { name: 'salesperson', type: 'VARCHAR(100)', constraints: '' },
        { name: 'region', type: 'VARCHAR(50)', constraints: '' },
        { name: 'revenue', type: 'NUMERIC(12,2)', constraints: '' }
    ],
    sampleData: [
        ['1', 'Alice', 'North', '5200.00'],
        ['2', 'Bob', 'South', '3100.00']
    ]
}];

const assignments = [
    // --- EASY (10 Tasks: assignment_1) ---
    { title: 'Filter Engineering', description: 'Basic filtering.', difficulty: 'Easy', question: 'Retrieve names and salaries of Engineering employees, highest salary first.', pgSchema: 'assignment_1', tags: ['SELECT', 'WHERE'], tableSchemas: employeeSchema, points: 10 },
    { title: 'Marketing List', description: 'Simple WHERE.', difficulty: 'Easy', question: 'Select all columns for employees in the Marketing department.', pgSchema: 'assignment_1', tags: ['WHERE'], tableSchemas: employeeSchema, points: 10 },
    { title: 'The 90k Club', description: 'Numeric filters.', difficulty: 'Easy', question: 'Find all employees earning more than 90,000.', pgSchema: 'assignment_1', tags: ['WHERE'], tableSchemas: employeeSchema, points: 10 },
    { title: 'Alphabetical Staff', description: 'Sorting text.', difficulty: 'Easy', question: 'List all employee names in alphabetical order.', pgSchema: 'assignment_1', tags: ['ORDER BY'], tableSchemas: employeeSchema, points: 10 },
    { title: 'Recent Hires', description: 'Date filtering.', difficulty: 'Easy', question: 'Find employees hired after January 1st, 2020.', pgSchema: 'assignment_1', tags: ['WHERE'], tableSchemas: employeeSchema, points: 10 },
    { title: 'HR Department Search', description: 'Column selection.', difficulty: 'Easy', question: 'Get just the names and hire dates of HR staff.', pgSchema: 'assignment_1', tags: ['SELECT'], tableSchemas: employeeSchema, points: 10 },
    { title: 'The "Alice" Check', description: 'Pattern matching.', difficulty: 'Easy', question: 'Find all data for employees named "Alice Johnson".', pgSchema: 'assignment_1', tags: ['WHERE'], tableSchemas: employeeSchema, points: 10 },
    { title: 'Salary Low to High', description: 'Ascending sort.', difficulty: 'Easy', question: 'List all employees ordered by salary from lowest to highest.', pgSchema: 'assignment_1', tags: ['ORDER BY'], tableSchemas: employeeSchema, points: 10 },
    { title: 'Department Diversity', description: 'Distinct values.', difficulty: 'Easy', question: 'Select all unique department names from the company.', pgSchema: 'assignment_1', tags: ['DISTINCT'], tableSchemas: employeeSchema, points: 10 },
    { title: 'Top 3 Earners', description: 'Limiting results.', difficulty: 'Easy', question: 'Show the top 3 highest-paid employees.', pgSchema: 'assignment_1', tags: ['LIMIT'], tableSchemas: employeeSchema, points: 10 },

    // --- MEDIUM (10 Tasks: assignment_2) ---
    { title: 'Customer Spending', description: 'JOIN + Aggregate.', difficulty: 'Medium', question: 'Show each customer name and their total amount spent.', pgSchema: 'assignment_2', tags: ['JOIN', 'SUM'], tableSchemas: orderCustomerSchema, points: 20 },
    { title: 'Chicago Orders', description: 'JOIN with Filter.', difficulty: 'Medium', question: 'List products ordered by customers living in Chicago.', pgSchema: 'assignment_2', tags: ['JOIN', 'WHERE'], tableSchemas: orderCustomerSchema, points: 20 },
    { title: 'Orders per Person', description: 'Counting rows.', difficulty: 'Medium', question: 'Count how many orders each customer has placed.', pgSchema: 'assignment_2', tags: ['COUNT', 'GROUP BY'], tableSchemas: orderCustomerSchema, points: 20 },
    { title: 'Big Ticket Items', description: 'JOIN + Condition.', difficulty: 'Medium', question: 'Find customer names who bought products over $1000.', pgSchema: 'assignment_2', tags: ['JOIN', 'WHERE'], tableSchemas: orderCustomerSchema, points: 20 },
    { title: 'Order History', description: 'Multi-table Sort.', difficulty: 'Medium', question: 'List all orders with customer emails, sorted by date.', pgSchema: 'assignment_2', tags: ['JOIN', 'ORDER BY'], tableSchemas: orderCustomerSchema, points: 20 },
    { title: 'Active Cities', description: 'Grouping.', difficulty: 'Medium', question: 'Find which cities have the most orders.', pgSchema: 'assignment_2', tags: ['GROUP BY', 'COUNT'], tableSchemas: orderCustomerSchema, points: 20 },
    { title: 'Average Order Value', description: 'Math functions.', difficulty: 'Medium', question: 'Calculate the average order amount for "Acme Corp".', pgSchema: 'assignment_2', tags: ['AVG', 'JOIN'], tableSchemas: orderCustomerSchema, points: 20 },
    { title: 'Product Popularity', description: 'Frequency.', difficulty: 'Medium', question: 'Which product has been ordered the most times?', pgSchema: 'assignment_2', tags: ['COUNT', 'GROUP BY', 'LIMIT'], tableSchemas: orderCustomerSchema, points: 20 },
    { title: 'Customer Email List', description: 'Basic JOIN.', difficulty: 'Medium', question: 'Show customer names alongside their order product names.', pgSchema: 'assignment_2', tags: ['JOIN'], tableSchemas: orderCustomerSchema, points: 20 },
    { title: 'Specific Date Orders', description: 'Time filter.', difficulty: 'Medium', question: 'Find customers who ordered on 2024-01-10.', pgSchema: 'assignment_2', tags: ['JOIN', 'WHERE'], tableSchemas: orderCustomerSchema, points: 20 },

    // --- HARD (10 Tasks: assignment_3) ---
    { title: 'Regional Top Seller', description: 'Advanced Aggregation.', difficulty: 'Hard', question: 'Find the salesperson with the highest revenue in each region.', pgSchema: 'assignment_3', tags: ['GROUP BY', 'MAX'], tableSchemas: salesSchema, points: 30 },
    { title: 'Total Revenue Ranking', description: 'Complex Sort.', difficulty: 'Hard', question: 'Rank regions by total revenue generated.', pgSchema: 'assignment_3', tags: ['SUM', 'GROUP BY', 'ORDER BY'], tableSchemas: salesSchema, points: 30 },
    { title: 'Electronics Mastery', description: 'Subqueries.', difficulty: 'Hard', question: 'Find salespeople whose Electronics revenue is above the average.', pgSchema: 'assignment_3', tags: ['SUBQUERY', 'AVG'], tableSchemas: salesSchema, points: 30 },
    { title: 'Furniture vs Electronics', description: 'Comparison.', difficulty: 'Hard', question: 'Compare total revenue of Furniture vs Electronics per region.', pgSchema: 'assignment_3', tags: ['CASE', 'SUM'], tableSchemas: salesSchema, points: 30 },
    { title: 'The 5k Club', description: 'Having clause.', difficulty: 'Hard', question: 'List regions that have total revenue greater than 5000.', pgSchema: 'assignment_3', tags: ['HAVING', 'SUM'], tableSchemas: salesSchema, points: 30 },
    { title: 'Top Categories', description: 'Multi-grouping.', difficulty: 'Hard', question: 'Find the best-selling category in the North region.', pgSchema: 'assignment_3', tags: ['WHERE', 'GROUP BY'], tableSchemas: salesSchema, points: 30 },
    { title: 'Performance Bonus', description: 'Math calculations.', difficulty: 'Hard', question: 'Show salesperson name and a 10% bonus calculated from their revenue.', pgSchema: 'assignment_3', tags: ['MATH'], tableSchemas: salesSchema, points: 30 },
    { title: 'Sales Consistency', description: 'Counting distinct.', difficulty: 'Hard', question: 'Find salespeople who have made sales in more than one region.', pgSchema: 'assignment_3', tags: ['COUNT', 'HAVING'], tableSchemas: salesSchema, points: 30 },
    { title: 'Daily Revenue Flow', description: 'Time series.', difficulty: 'Hard', question: 'Show total revenue for each day of February 2024.', pgSchema: 'assignment_3', tags: ['WHERE', 'SUM', 'GROUP BY'], tableSchemas: salesSchema, points: 30 },
    { title: 'Underperformers', description: 'Filters.', difficulty: 'Hard', question: 'Find all salespeople who generated less than 2000 in revenue.', pgSchema: 'assignment_3', tags: ['WHERE'], tableSchemas: salesSchema, points: 30 }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Assignment.deleteMany({});
        const inserted = await Assignment.insertMany(assignments);
        console.log(`✅ Seeded ${inserted.length} assignments with full schemas and sample data!`);

        mongoose.disconnect();
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seed();