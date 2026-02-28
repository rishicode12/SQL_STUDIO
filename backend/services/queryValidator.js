/**
 * SQL Query Sanitizer & Validator
 * Prevents dangerous operations in the sandbox environment.
 */

// Allowed SQL operations (read-only + basic DML for learning)
const ALLOWED_STATEMENTS = ['SELECT', 'WITH'];

// Blocked keywords that could cause damage
const BLOCKED_KEYWORDS = [
  'DROP',
  'DELETE',
  'TRUNCATE',
  'ALTER',
  'CREATE',
  'INSERT',
  'UPDATE',
  'GRANT',
  'REVOKE',
  'EXEC',
  'EXECUTE',
  'COPY',
  'pg_sleep',
  'pg_read_file',
  'pg_write_file',
  'lo_import',
  'lo_export',
  'LOAD',
  '--',
  ';--',
];

/**
 * Validates and sanitizes SQL query
 * @param {string} query
 * @returns {{ valid: boolean, error?: string, sanitized?: string }}
 */
const validateQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return { valid: false, error: 'Query must be a non-empty string.' };
  }

  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Query cannot be empty.' };
  }

  if (trimmed.length > 5000) {
    return { valid: false, error: 'Query is too long (max 5000 characters).' };
  }

  // Check for multiple statements (semicolons mid-query)
  const withoutStrings = trimmed.replace(/'[^']*'/g, "''");
  const statements = withoutStrings.split(';').filter((s) => s.trim().length > 0);
  if (statements.length > 1) {
    return { valid: false, error: 'Multiple statements are not allowed. Use a single query.' };
  }

  // Check for blocked keywords (case insensitive)
  const upperQuery = trimmed.toUpperCase();
  for (const keyword of BLOCKED_KEYWORDS) {
    // Word boundary check for keywords, direct check for operators
    const regex = /^[A-Z_]/.test(keyword)
      ? new RegExp(`\\b${keyword}\\b`)
      : new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (regex.test(upperQuery)) {
      return {
        valid: false,
        error: `Operation not allowed: "${keyword}" is blocked in the sandbox.`,
      };
    }
  }

  // Must start with an allowed statement
  const firstWord = upperQuery.split(/\s+/)[0];
  if (!ALLOWED_STATEMENTS.includes(firstWord)) {
    return {
      valid: false,
      error: `Only SELECT queries are allowed. Your query starts with "${firstWord}".`,
    };
  }

  return { valid: true, sanitized: trimmed };
};

module.exports = { validateQuery };
