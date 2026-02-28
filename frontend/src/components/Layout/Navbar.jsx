import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { mode, toggle } = useTheme();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">SQL</div>
          <span className="navbar__logo-text">
            <span className="cipher">Cipher</span>
            <span className="sql">Studio</span>
          </span>
        </Link>

        <div className="navbar__actions">
          <button
            aria-label="Toggle theme"
            className="theme-toggle"
            onClick={toggle}
          >
            {mode === 'dark' ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <div className="navbar__user">
                <div className="navbar__user-dot" />
                <span>{user.name}</span>
              </div>
              <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">Login</Link>
              <Link to="/register" className="btn btn--primary btn--sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
