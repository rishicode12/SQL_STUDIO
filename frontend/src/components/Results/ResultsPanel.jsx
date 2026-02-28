import React from 'react';

const ResultsPanel = ({ result, loading }) => {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="results-panel__empty">
          <div className="spinner" />
          <span>Executing query...</span>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="results-panel__empty">
          <span className="results-panel__empty-icon">⚡</span>
          <span>Run a query to see results here</span>
        </div>
      );
    }

    if (!result.success) {
      return (
        <div className="results-panel__error">
          <div className="results-panel__error-title">SQL Error</div>
          <div className="results-panel__error-message">{result.error}</div>
          {result.hint && (
            <div className="results-panel__error-hint">Hint: {result.hint}</div>
          )}
        </div>
      );
    }

    const { rows, fields, rowCount } = result.data;

    if (!rows || rows.length === 0) {
      return (
        <div className="results-panel__empty">
          <span className="results-panel__empty-icon">🔍</span>
          <span>Query ran successfully — no rows returned</span>
        </div>
      );
    }

    return (
      <table className="results-table">
        <thead className="results-table__head">
          <tr>
            {fields.map((f) => (
              <th key={f.name} className="results-table__th">{f.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="results-table__tr">
              {fields.map((f) => (
                <td
                  key={f.name}
                  className={`results-table__td${row[f.name] === null ? ' results-table__td--null' : ''}`}
                >
                  {row[f.name] === null ? 'NULL' : String(row[f.name])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const dotClass = !result
    ? ''
    : loading
    ? 'results-panel__title-dot--running'
    : result.success
    ? 'results-panel__title-dot--success'
    : 'results-panel__title-dot--error';

  return (
    <div className="results-panel">
      <div className="results-panel__header">
        <span className="results-panel__title">
          <span className={`results-panel__title-dot ${dotClass}`} />
          Results
        </span>
        {result?.success && (
          <span className="results-panel__meta">
            {result.data.rowCount} row{result.data.rowCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="results-panel__body">{renderContent()}</div>
    </div>
  );
};

export default ResultsPanel;
