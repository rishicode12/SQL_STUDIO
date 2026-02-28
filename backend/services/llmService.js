const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODELS_TO_TRY = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

const generateHint = async ({ question, userQuery, errorMessage, tableSchemas }) => {
  const schemaContext = tableSchemas
    .map((t) => {
      const cols = t.columns.map((c) => `  ${c.name} ${c.type} ${c.constraints}`).join('\n');
      return `Table: ${t.tableName}\nColumns:\n${cols}`;
    })
    .join('\n\n');

  const systemPrompt = `You are a SQL tutor assistant for CipherSQLStudio, a platform where students learn SQL.

Your ONLY job is to give HINTS — never give the complete solution.

Rules you must follow strictly:
1. NEVER write the correct SQL query for the user.
2. NEVER complete their query for them.
3. DO point them toward the right concept, clause, or function.
4. DO explain what is wrong with their current query if they have one.
5. DO suggest what SQL clause or concept they should look up.
6. Keep hints concise (2-4 sentences max).
7. Use encouraging, educational language.
8. If they have a syntax error, explain the syntax rule — don't fix it for them.
9. If they're close, tell them they're close and nudge in the right direction.

Examples of GOOD hints:
- "You're on the right track! Think about how GROUP BY works with aggregate functions."
- "Your WHERE clause is filtering correctly, but look into JOIN to connect the two tables."
- "The error says column doesn't exist — check the exact column name in the schema."

Examples of BAD hints (never do these):
- "The correct query is: SELECT name FROM users WHERE..."
- "Just add ORDER BY salary DESC LIMIT 1 at the end."`;

  const userMessage = `Assignment Question:
${question}

Table Schemas:
${schemaContext}

Student's Current Query:
${userQuery || '(empty — student has not written anything yet)'}

${errorMessage ? `SQL Error the student got:\n${errorMessage}` : ''}

Please give a helpful hint to guide this student without solving it for them.`;

  let lastError;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      });
      const result = await model.generateContent(userMessage);
      console.log(`Hint generated using model: ${modelName}`);
      return result.response.text().trim();
    } catch (err) {
      console.warn(`Model "${modelName}" failed: ${err.message}`);
      lastError = err;
    }
  }

  throw lastError;
};

module.exports = { generateHint };