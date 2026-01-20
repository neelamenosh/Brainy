const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/auth';

interface RegisterPayload {
  rollNumber: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  department: string;
  course?: string;
  semester?: number;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    rollNumber: string;
    fullName: string;
    email: string;
    role: string;
    department: string;
  };
}

interface VerifyResponse {
  user: {
    id: string;
    rollNumber: string;
    fullName: string;
    email: string;
    role: string;
    department: string;
  };
}

class AuthApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

const apiCall = async <T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown
): Promise<T> => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const token = localStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      throw new AuthApiError(errorMessage, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new AuthApiError(
        'Network error. Please check your connection.',
        undefined,
        error
      );
    }

    throw new AuthApiError(
      'An unexpected error occurred',
      undefined,
      error
    );
  }
};

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    if (!payload.rollNumber?.trim()) {
      throw new AuthApiError('Please enter a valid roll number');
    }

    if (!payload.fullName || payload.fullName.trim().length < 2) {
      throw new AuthApiError('Please enter a valid full name (at least 2 characters)');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      throw new AuthApiError('Please enter a valid email address');
    }

    if (!payload.phone || payload.phone.length < 10) {
      throw new AuthApiError('Please enter a valid phone number');
    }

    if (!payload.password || payload.password.length < 6) {
      throw new AuthApiError('Password must be at least 6 characters');
    }

    if (!payload.department) {
      throw new AuthApiError('Please select a department');
    }

    return apiCall<AuthResponse>('/register', 'POST', payload);
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      throw new AuthApiError('Please enter a valid email address');
    }

    if (!payload.password || payload.password.length < 6) {
      throw new AuthApiError('Password must be at least 6 characters');
    }

    return apiCall<AuthResponse>('/login', 'POST', payload);
  },

  verify: async (): Promise<VerifyResponse> => {
    return apiCall<VerifyResponse>('/verify', 'GET');
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    return apiCall('/refresh-token', 'POST', { refreshToken });
  },

  logout: async (): Promise<{ message: string }> => {
    return apiCall('/logout', 'POST');
  },

  getProfile: async (): Promise<{ user: AuthResponse['user'] }> => {
    return apiCall('/me', 'GET');
  },

  updateProfile: async (payload: Partial<RegisterPayload>): Promise<AuthResponse> => {
    return apiCall('/profile', 'PUT', payload);
  },
};

export type { AuthResponse, VerifyResponse, RegisterPayload, LoginPayload };
export { AuthApiError };
