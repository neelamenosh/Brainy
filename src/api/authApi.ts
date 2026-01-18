// API utility for authentication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface SendOTPPayload {
  rollNumber: string;
  phone: string;
}

interface VerifyOTPPayload {
  rollNumber: string;
  otp: string;
}

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

interface AuthResponse {
  message: string;
  token: string;
  refreshToken?: string;
  status?: string;
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

interface OTPResponse {
  message: string;
  rollNumber: string;
  status?: string;
  demo_otp?: string;
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

// Helper function to validate input
const validateRollNumber = (rollNumber: string): boolean => {
  return rollNumber && rollNumber.trim().length > 0;
};

const validatePhone = (phone: string): boolean => {
  return phone && phone.length >= 10;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password && password.length >= 6;
};

// Helper function for API calls with error handling
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

    // Add token if available
    const token = localStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // Handle network errors
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
  // Send OTP to roll number
  sendOTP: async (rollNumber: string, phone: string): Promise<OTPResponse> => {
    if (!validateRollNumber(rollNumber)) {
      throw new AuthApiError('Please enter a valid roll number');
    }

    if (!validatePhone(phone)) {
      throw new AuthApiError('Please enter a valid phone number');
    }

    const payload: SendOTPPayload = { rollNumber: rollNumber.trim(), phone };
    return apiCall<OTPResponse>('/auth/send-otp', 'POST', payload);
  },

  // Verify OTP
  verifyOTP: async (rollNumber: string, otp: string): Promise<AuthResponse | OTPResponse> => {
    if (!validateRollNumber(rollNumber)) {
      throw new AuthApiError('Please enter a valid roll number');
    }

    if (!otp || otp.length !== 6) {
      throw new AuthApiError('Please enter a valid 6-digit OTP');
    }

    const payload: VerifyOTPPayload = { rollNumber: rollNumber.trim(), otp };
    return apiCall<AuthResponse | OTPResponse>('/auth/verify-otp', 'POST', payload);
  },

  // Register new user (after OTP verification)
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    if (!validateRollNumber(payload.rollNumber)) {
      throw new AuthApiError('Please enter a valid roll number');
    }

    if (!payload.fullName || payload.fullName.trim().length < 2) {
      throw new AuthApiError('Please enter a valid full name (at least 2 characters)');
    }

    if (!validateEmail(payload.email)) {
      throw new AuthApiError('Please enter a valid email address');
    }

    if (!validatePhone(payload.phone)) {
      throw new AuthApiError('Please enter a valid phone number');
    }

    if (!validatePassword(payload.password)) {
      throw new AuthApiError('Password must be at least 6 characters');
    }

    if (!payload.department) {
      throw new AuthApiError('Please select a department');
    }

    return apiCall<AuthResponse>('/auth/register', 'POST', payload);
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    return apiCall('/auth/refresh-token', 'POST', { refreshToken });
  },

  // Verify token validity
  verify: async (): Promise<VerifyResponse> => {
    return apiCall<VerifyResponse>('/auth/verify', 'GET');
  },

  // Logout
  logout: async (): Promise<{ message: string }> => {
    return apiCall('/auth/logout', 'POST');
  },
};

export type { AuthResponse, VerifyResponse, OTPResponse, AuthApiError };
