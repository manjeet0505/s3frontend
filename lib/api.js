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
  cached: (userId) => api.get(`/jobs/cached?user_id=${userId}`),
  scrapeAndMatch: (userId) => api.post(`/jobs/scrape-and-match?user_id=${userId}`, {}, {
    timeout: 120000
  }),
};

// ─── Mentor Matching — student-facing ─────────────────
export const mentorsApi = {
  // Fast: reads cached results from MongoDB — use on page load
  cached: (userId) => api.get(`/mentors/cached?user_id=${userId}`),
  // Slow: runs full Qdrant+GPT-4o agent — use only on Refresh click
  match: (userId) => api.get(`/mentors/match?user_id=${userId}`),
};

// ─── Mentor Profile — mentor-facing ───────────────────
export const mentorApi = {
  setupProfile: (userId, data) => api.post(`/mentor/setup?user_id=${userId}`, data),
  getProfile: (userId) => api.get(`/mentor/profile?user_id=${userId}`),

  // ← ADDED: upload photo to Cloudinary via backend
  uploadPhoto: (userId, formData) => api.post(`/mentor/upload-photo?user_id=${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  getIncomingSessions: (mentorId) => api.get(`/mentor/sessions/incoming?mentor_id=${mentorId}`),
  getMySessions: (studentId) => api.get(`/mentor/sessions/my?student_id=${studentId}`),

  // FIX: explicit JSON header so FastAPI Pydantic receives correct content-type
  requestSession: (data) => api.post('/mentor/session/request', data, {
    headers: { 'Content-Type': 'application/json' }
  }),

  respondToSession: (sessionId, status, meetingLink = null) => {
    const params = new URLSearchParams({ session_id: sessionId, status });
    if (meetingLink) params.append('meeting_link', meetingLink);
    return api.post(`/mentor/session/respond?${params}`);
  },

  // Cancel session — works for both student and mentor
  cancelSession: (sessionId, userId) =>
    api.delete(`/mentor/session/cancel?session_id=${sessionId}&user_id=${userId}`),
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

// ─── Chat (RAG) ───────────────────────────────────────
export const chatApi = {
  // Uses native fetch (not axios) because axios doesn't support SSE streaming
  sendMessage: (userId, message, conversationId = null, userName = null) =>
    fetch(`${BASE_URL}/chat/message?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('authToken') : ''}`,
      },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        user_name: userName,
      }),
    }),

  getConversations: (userId) =>
    api.get(`/chat/conversations?user_id=${userId}`),

  getMessages: (userId, conversationId) =>
    api.get(`/chat/messages?user_id=${userId}&conversation_id=${conversationId}`),

  deleteConversation: (userId, conversationId) =>
    api.delete(`/chat/conversation?user_id=${userId}&conversation_id=${conversationId}`),

  getIndexStatus: (userId) =>
    api.get(`/chat/ingest/status?user_id=${userId}`),

  ingest: (userId, sourceType, data) =>
    api.post(`/chat/ingest?user_id=${userId}`, { source_type: sourceType, data }),
};

export default api;