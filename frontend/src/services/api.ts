import axios from 'axios';
import { LoginCredentials, RegisterCredentials, Task } from '../types';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API methods
 * - User registration
 * - User login
 */
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },
  register: async (credentials: RegisterCredentials) => {
    const response = await api.post('/auth/register', credentials);
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

/**
 * Task management API methods
 * - CRUD operations for tasks
 * - Task statistics
 */
export const taskApi = {
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  createTask: async (task: Partial<Task>) => {
    const response = await api.post('/tasks', task);
    return response.data;
  },
  updateTask: async (id: number, task: Partial<Task>) => {
    const response = await api.patch(`/tasks/${id}`, task);
    return response.data;
  },
  deleteTask: async (id: number) => {
    await api.delete(`/tasks/${id}`);
  },
  getTaskStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
};

export default api;
