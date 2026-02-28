import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { fetchAssignment, executeQuery, saveAttempt } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SchemaViewer from './SchemaViewer';
import ResultsPanel from '../Results/ResultsPanel';
import HintPanel from '../Hints/HintPanel';

const TABS = ['Question', 'Schema'];

const AssignmentAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const editorRef = useRef(null);

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('-- Write your SQL query here\nSELECT ');
  const [result, setResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [lastError, setLastError] = useState('');
  const [activeTab, setActiveTab] = useState('Question');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAssignment(id);
        setAssignment(res.data.data);
      } catch (err) {
        setError('Assignment not found.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleExecute = useCallback(async () => {
    if (!query.trim() || executing) return;

    setExecuting(true);
    setResult(null);
    setLastError('');

    try {
      const res = await executeQuery(id, query);
      setResult(res.data);
      if (!res.data.success) setLastError(res.data.error || '');
    } catch (err) {
      const errData = err.response?.data;
      setResult(errData || { success: false, error: 'Network error' });
      setLastError(errData?.error || '');
    } finally {
      setExecuting(false);
    }
  }, [query, id, executing]);

  // Ctrl+Enter / Cmd+Enter to run
  const handleEditorMount = (editor) => {
    editorRef.current = editor;
    editor.addCommand(
      // eslint-disable-next-line no-bitwise
      window.monaco?.KeyMod?.CtrlCmd | window.monaco?.KeyCode?.Enter,
      handleExecute
    );
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await saveAttempt(id, query);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner spinner--lg" />
        <span>Loading assignment...</span>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="assignment-list-page">
        <div className="results-panel__error">
          <div className="results-panel__error-title">Not Found</div>
          <div className="results-panel__error-message">{error || 'Assignment not found.'}</div>
          <button className="btn btn--ghost btn--sm" style={{ marginTop: '12px' }} onClick={() => navigate('/')}>
            ← Back to assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="attempt-page">
      <div className="attempt-layout">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="panel-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`panel-tabs__tab${activeTab === tab ? ' panel-tabs__tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Question' ? (
            <div className="question-panel">
              <div
                className="question-panel__back"
                onClick={() => navigate('/')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
              >
                ← All assignments
              </div>
              <div className="question-panel__meta">
                <span className={`assignment-card__difficulty assignment-card__difficulty--${assignment.difficulty}`}>
                  {assignment.difficulty}
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {assignment.tags?.map((tag) => (
                    <span key={tag} className="assignment-card__tag">{tag}</span>
                  ))}
                </div>
              </div>
              <h1 className="question-panel__title">{assignment.title}</h1>
              <div className="question-panel__question">{assignment.question}</div>
            </div>
          ) : (
            <SchemaViewer tableSchemas={assignment.tableSchemas} />
          )}
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {/* Editor */}
          <div className="editor-area">
            <div className="editor-toolbar">
              <div className="editor-toolbar__left">
                <span className="editor-toolbar__label">SQL Editor</span>
                <span style={{ fontSize: '0.72rem', color: '#4a5568' }}>
                  Ctrl+Enter to run
                </span>
              </div>
              <div className="editor-toolbar__right">
                {user && (
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={handleSave}
                    disabled={saved}
                  >
                    {saved ? '✓ Saved' : 'Save Query'}
                  </button>
                )}
                <button
                  className="btn btn--success btn--sm"
                  onClick={handleExecute}
                  disabled={executing}
                >
                  {executing ? (
                    <><div className="spinner spinner--sm" /> Running...</>
                  ) : (
                    '▶ Run Query'
                  )}
                </button>
              </div>
            </div>
            <div className="monaco-wrapper">
              <Editor
                height="100%"
                defaultLanguage="sql"
                value={query}
                onChange={(val) => setQuery(val || '')}
                onMount={handleEditorMount}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                }}
              />
            </div>
          </div>

          {/* Results */}
          <ResultsPanel result={result} loading={executing} />

          {/* Hints */}
          <HintPanel
            assignmentId={id}
            userQuery={query}
            lastError={lastError}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignmentAttempt;
