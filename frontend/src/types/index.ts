export interface User {
  id: number;
  username: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {}


export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface TaskStats {
  total: number;
  completed: number;
  dueToday: number;
  dueThisWeek: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}
