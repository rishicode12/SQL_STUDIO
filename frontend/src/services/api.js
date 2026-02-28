import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Assignments ---
export const fetchAssignments = () => api.get('/assignments');
export const fetchAssignment = (id) => api.get(`/assignments/${id}`);

// --- Query ---
export const executeQuery = (assignmentId, query) =>
  api.post('/query/execute', { assignmentId, query });

// --- Hints ---
export const getHint = ({ assignmentId, userQuery, errorMessage }) =>
  api.post('/hints', { assignmentId, userQuery, errorMessage });

// --- Auth ---
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const saveAttempt = (assignmentId, query) =>
  api.post('/auth/attempts', { assignmentId, query });

export default api;
