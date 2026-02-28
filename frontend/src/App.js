import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import AssignmentList from './components/AssignmentList/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt/AssignmentAttempt';
import AuthPage from './components/auth/AuthPage';
import './styles/main.scss';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<AssignmentList />} />
            <Route path="/assignment/:id" element={<AssignmentAttempt />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
