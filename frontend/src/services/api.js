import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────
export const register = (data) => API.post('/auth/register/', data);
export const login = (data) => API.post('/auth/login/', data);
export const getProfile = () => API.get('/auth/profile/');

// ── Resume ────────────────────────────────────────────
export const uploadResume = (formData) =>
  API.post('/resume/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getResume = () => API.get('/resume/');

// ── AI Features ───────────────────────────────────────
export const generateCoverLetter = (data) => API.post('/ai/cover-letter/', data);
export const analyseSkillMatch = (data) => API.post('/ai/skill-match/', data);
export const generateInterviewQuestions = (data) => API.post('/ai/interview-questions/', data);

// ── Job Applications ──────────────────────────────────
export const getApplications = (status) =>
  API.get('/applications/', { params: status ? { status } : {} });
export const createApplication = (data) => API.post('/applications/', data);
export const updateApplication = (id, data) => API.patch(`/applications/${id}/`, data);
export const deleteApplication = (id) => API.delete(`/applications/${id}/`);
export const getKanbanBoard = () => API.get('/applications/kanban/');

export default API;
