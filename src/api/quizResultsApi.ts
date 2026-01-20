interface SaveQuizResultPayload {
  categoryId: string;
  categoryName: string;
  courseId?: string;
  courseName?: string;
  score: number;
  total: number;
}

class QuizResultsApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'QuizResultsApiError';
  }
}

const apiCall = async <T>(endpoint: string, method: string, body?: unknown): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/quiz${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = 'An error occurred';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch {
      message = response.statusText || message;
    }
    throw new QuizResultsApiError(message, response.status);
  }

  return response.json();
};

export const quizResultsApi = {
  saveResult: async (payload: SaveQuizResultPayload) => {
    return apiCall<{ attempt: unknown }>(`/results`, 'POST', payload);
  },

  listMyResults: async () => {
    return apiCall<{ attempts: unknown[] }>(`/results`, 'GET');
  },
};

export type { SaveQuizResultPayload };
export { QuizResultsApiError };
