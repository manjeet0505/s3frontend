import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Auto-attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Get user_id from JWT token
export function getUserId() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch {
    return null;
  }
}

// Get full user from token
export function getUser() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

// ─── Resume ───────────────────────────────────────────
export const resumeApi = {
  upload: (formData, userId) => api.post(`/resume/parse?user_id=${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getProfile: (userId) => api.get(`/resume/profile/${userId}`),
  getScore: (userId) => api.get(`/resume/score/${userId}`),
};

// ─── Jobs ─────────────────────────────────────────────
export const jobsApi = {
  scrape: (userId) => api.post(`/jobs/scrape?user_id=${userId}`),
  match: (userId) => api.get(`/jobs/match?user_id=${userId}`),
  list: (userId) => api.get(`/jobs/list?user_id=${userId}`),
  scrapeAndMatch: (userId) => api.post(`/jobs/scrape-and-match?user_id=${userId}`),
};

// ─── Mentor Matching — student-facing (/mentors/match) ─
export const mentorsApi = {
  match: (userId) => api.get(`/mentors/match?user_id=${userId}`),
};

// ─── Mentor Profile — mentor-facing (/mentor/...) ──────
export const mentorApi = {
  setupProfile: (userId, data) => api.post(`/mentor/setup?user_id=${userId}`, data),
  getProfile: (userId) => api.get(`/mentor/profile?user_id=${userId}`),
  getIncomingSessions: (mentorId) => api.get(`/mentor/sessions/incoming?mentor_id=${mentorId}`),
  getMySessions: (studentId) => api.get(`/mentor/sessions/my?student_id=${studentId}`),
  requestSession: (data) => api.post('/mentor/session/request', data),
  respondToSession: (sessionId, status, meetingLink = null) => {
    const params = new URLSearchParams({ session_id: sessionId, status });
    if (meetingLink) params.append('meeting_link', meetingLink);
    return api.post(`/mentor/session/respond?${params}`);
  },
};

// ─── Skills ───────────────────────────────────────────
export const skillsApi = {
  getGap: (userId) => api.get(`/skills/gap?user_id=${userId}`),
  getGapResult: (userId) => api.get(`/skills/gap/result?user_id=${userId}`),
};

// ─── Progress ─────────────────────────────────────────
export const progressApi = {
  get: (userId) => api.get(`/progress?user_id=${userId}`),
  update: (userId, skill, status) => api.post(`/progress/update?user_id=${userId}`, { skill, status }),
  reset: (userId) => api.post(`/progress/reset?user_id=${userId}`),
};

export default api;