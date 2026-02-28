import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAssignments } from '../../services/api';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAssignments();
        setAssignments(res.data.data);
      } catch (err) {
        setError('Failed to load assignments. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    filter === 'All'
      ? assignments
      : assignments.filter((a) => a.difficulty === filter);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner spinner--lg" />
        <span>Loading assignments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignment-list-page">
        <div className="results-panel__error">
          <div className="results-panel__error-title">Error</div>
          <div className="results-panel__error-message">{error}</div>
        </div>
      </div>
    );
  }

  const counts = {
    Easy: assignments.filter((a) => a.difficulty === 'Easy').length,
    Medium: assignments.filter((a) => a.difficulty === 'Medium').length,
    Hard: assignments.filter((a) => a.difficulty === 'Hard').length,
  };

  return (
    <main className="assignment-list-page">
      <header className="page-header">
        <h1 className="page-header__title">SQL Assignments</h1>
        <p className="page-header__sub">
          Practice real SQL queries against live data. Pick an assignment to begin.
        </p>
        <div className="page-header__stats">
          {Object.entries(counts).map(([diff, count]) => (
            <div key={diff} className="page-header__stat">
              <div className="page-header__stat-value">{count}</div>
              <div className="page-header__stat-label">{diff}</div>
            </div>
          ))}
          <div className="page-header__stat">
            <div className="page-header__stat-value">{assignments.length}</div>
            <div className="page-header__stat-label">Total</div>
          </div>
        </div>
      </header>

      <div className="filter-bar">
        <div className="filter-bar__filters">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              className={`filter-bar__btn${filter === d ? ' filter-bar__btn--active' : ''}`}
              onClick={() => setFilter(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.8rem', color: '#8892a4' }}>
          {filtered.length} assignment{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="results-panel__empty">
          <span className="results-panel__empty-icon">📭</span>
          <span>No assignments found.</span>
        </div>
      ) : (
        <div className="assignment-grid">
          {filtered.map((assignment, idx) => (
            <div
              key={assignment._id}
              className="assignment-card"
              onClick={() => navigate(`/assignment/${assignment._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/assignment/${assignment._id}`)}
            >
              <div className="assignment-card__header">
                <span className={`assignment-card__difficulty assignment-card__difficulty--${assignment.difficulty}`}>
                  {assignment.difficulty}
                </span>
                <span className="assignment-card__number">#{String(idx + 1).padStart(2, '0')}</span>
              </div>
              <h2 className="assignment-card__title">{assignment.title}</h2>
              <p className="assignment-card__description">{assignment.description}</p>
              <div className="assignment-card__tags">
                {assignment.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="assignment-card__tag">{tag}</span>
                ))}
              </div>
              <span className="assignment-card__arrow">→</span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AssignmentList;
