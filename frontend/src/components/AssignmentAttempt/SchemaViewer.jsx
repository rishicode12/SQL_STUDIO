import React, { useState } from 'react';

const SchemaTable = ({ table }) => {
  const [showSample, setShowSample] = useState(false);

  return (
    <div className="schema-table">
      <div
        className="schema-table__name"
        onClick={() => setShowSample((p) => !p)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowSample((p) => !p)}
      >
        <span className="schema-table__name-icon">▶</span>
        {table.tableName}
      </div>

      <div className="schema-table__columns">
        {table.columns.map((col) => (
          <div key={col.name} className="schema-table__col">
            <span className="schema-table__col-name">{col.name}</span>
            <span className="schema-table__col-type">{col.type}</span>
            <span className="schema-table__col-constraint">{col.constraints}</span>
          </div>
        ))}
        <div
          className="schema-table__sample-toggle"
          onClick={() => setShowSample((p) => !p)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setShowSample((p) => !p)}
        >
          {showSample ? '▲ Hide sample data' : '▼ View sample data'}
        </div>
      </div>

      {showSample && table.sampleData?.length > 0 && (
        <div className="schema-table__sample">
          <table className="schema-table__sample-table">
            <thead>
              <tr>
                {table.columns.map((col) => (
                  <th key={col.name}>{col.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.sampleData.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell === null ? 'NULL' : cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const SchemaViewer = ({ tableSchemas }) => {
  if (!tableSchemas || tableSchemas.length === 0) {
    return (
      <div className="schema-viewer">
        <p style={{ color: '#8892a4', fontSize: '0.85rem' }}>No schema available.</p>
      </div>
    );
  }

  return (
    <div className="schema-viewer">
      <div className="schema-viewer__heading">Tables</div>
      {tableSchemas.map((table) => (
        <SchemaTable key={table.tableName} table={table} />
      ))}
    </div>
  );
};

export default SchemaViewer;
