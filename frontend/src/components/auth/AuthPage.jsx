import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, login } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AuthPage = ({ mode }) => {
  // derive from prop but keep local state for the switch links
  const [isLogin, setIsLogin] = useState(mode === 'login');

  // keep state in sync when route prop changes (navbar links)
  React.useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = isLogin
        ? await login({ email: form.email, password: form.password })
        : await register(form);

      loginUser(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="auth-card__sub">
          {isLogin
            ? 'Sign in to save your SQL query attempts.'
            : 'Join CipherSQLStudio and start practicing SQL.'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        {!isLogin && (
          <div className="form-group">
            <label className="form-group__label">Name</label>
            <input
              className="form-group__input"
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-group__label">Email</label>
          <input
            className="form-group__input"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="form-group">
          <label className="form-group__label">Password</label>
          <input
            className="form-group__input"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          className="btn btn--primary"
          style={{ width: '100%' }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <><div className="spinner spinner--sm" /> {isLogin ? 'Signing in...' : 'Creating account...'}</>
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>

        <div className="auth-card__switch">
          {isLogin ? (
            <>Don't have an account? <Link to="/register" onClick={() => setIsLogin(false)}>Sign up</Link></>
          ) : (
            <>Already have an account? <Link to="/login" onClick={() => setIsLogin(true)}>Sign in</Link></>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
