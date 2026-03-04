const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('decky_token');
  const userId = localStorage.getItem('decky_user_id');

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (userId) {
    headers.set('X-User-Id', userId);
  }
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type');
  const isText = headers.get('Accept') === 'text/plain' || (contentType && !contentType.includes('application/json'));

  let data;
  if (isText) {
    data = await response.text();
  } else {
    try {
      data = await response.json();
    } catch (e) {
      data = await response.text();
    }
  }

  if (!response.ok) {
    throw new Error(typeof data === 'object' ? (data.message || response.statusText) : (data || response.statusText));
  }

  return data as T;
}

export const api = {
  auth: {
    signup: (body: any) => request<string>('/auth/signup', { 
      method: 'POST', 
      body: JSON.stringify(body),
      headers: { 'Accept': 'text/plain' }
    }),
    login: (body: any) => request<string>('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify(body), 
      headers: { 'Accept': 'text/plain' } 
    }),
  },
  flashcards: {
    getAll: () => request<any[]>('/api/flashcards'),
    create: (body: any) => request<any>('/api/flashcards', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: any) => request<any>(`/api/flashcards/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (deckId: string, id: string) => request(`/api/flashcards/${deckId}/${id}`, { method: 'DELETE' }),
    getDecks: () => request<string[]>('/api/flashcards/decks'),
    getDeckContent: (deckId: string) => request<any[]>(`/api/flashcards/deck/${deckId}`),
    getDeckSize: (deckId: string) => request<any>(`/api/flashcards/deck/${deckId}/size`),
    reviewBatch: (body: any) => request<any[]>('/api/flashcards/review', { method: 'POST', body: JSON.stringify(body) }),
    submitReview: (id: string, quality: number) => request(`/api/flashcards/${id}/review?quality=${quality}`, { method: 'POST' }),
  },
  sessions: {
    create: (body: any) => request<any>('/api/sessions', { method: 'POST', body: JSON.stringify(body) }),
    get: (deckId: string, batchSize = 20) => request<any>(`/api/sessions?deckId=${deckId}&batchSize=${batchSize}`),
    submitReview: (cardId: string, quality: number) => request(`/api/sessions/${cardId}/review?quality=${quality}`, { method: 'POST' }),
  },
};
