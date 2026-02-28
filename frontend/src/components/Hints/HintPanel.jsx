import React, { useState } from 'react';
import { getHint } from '../../services/api';

const HintPanel = ({ assignmentId, userQuery, lastError }) => {
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const handleGetHint = async () => {
    setLoading(true);
    setError('');
    setOpen(true);

    try {
      const res = await getHint({
        assignmentId,
        userQuery,
        errorMessage: lastError || '',
      });
      setHint(res.data.hint);
    } catch (err) {
      setError('Could not generate hint. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`hint-panel${open ? ' hint-panel--open' : ''}`}>
      <div className="hint-panel__header" onClick={() => hint && setOpen((p) => !p)}>
        <span className="hint-panel__title">
          <span className="hint-panel__title-icon">💡</span>
          AI Hint
          {hint && <span style={{ color: '#4a5568', fontSize: '0.75rem' }}>{open ? ' ▲' : ' ▼'}</span>}
        </span>
        <button
          className="btn btn--warning btn--sm"
          onClick={(e) => { e.stopPropagation(); handleGetHint(); }}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner spinner--sm" />
              Thinking...
            </>
          ) : (
            'Get Hint'
          )}
        </button>
      </div>

      {open && (
        <div className="hint-panel__body">
          {loading ? (
            <div className="hint-panel__loading">
              <div className="hint-panel__loading-dots">
                <span /><span /><span />
              </div>
              Generating hint...
            </div>
          ) : error ? (
            <div className="hint-panel__message" style={{ borderLeftColor: '#f0546e', background: 'rgba(240,84,110,0.06)' }}>
              {error}
            </div>
          ) : hint ? (
            <div className="hint-panel__message">{hint}</div>
          ) : (
            <div className="hint-panel__empty">Click "Get Hint" to get guidance.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HintPanel;
