import { Chapter, Coach, Event, CertificationProgram, Testimonial } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || 'API request failed')
  }

  return res.json()
}

export const api = {
  chapters: {
    list: (params?: { region?: string; language?: string; status?: string; page?: number; page_size?: number }) => {
      const query = new URLSearchParams(params as any).toString()
      return fetcher<{ data: Chapter[]; total: number; page: number; page_size: number }>(`/chapters?${query}`)
    },
    get: (id: string) => fetcher<Chapter>(`/chapters/${id}`),
    approve: (id: string, status: 'active' | 'inactive') => fetcher<any>(`/chapters/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),
    create: (data: any) => fetcher<Chapter>('/chapters', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }),
  },
  coaches: {
    list: (params?: { chapter_id?: string; certification_level?: string; language?: string; specialization?: string; page?: number; page_size?: number; approved?: boolean }) => {
      const query = new URLSearchParams(params as any).toString()
      return fetcher<{ data: Coach[]; total: number; page: number; page_size: number }>(`/coaches?${query}`)
    },
    approve: (id: string, approved: boolean) => fetcher<any>(`/coaches/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approved }),
    }),
    create: (data: any) => fetcher<Coach>('/coaches', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }),
  },
  events: {
    list: (params?: { chapter_id?: string; event_type?: string; page?: number; page_size?: number }) => {
      const query = new URLSearchParams(params as any).toString()
      return fetcher<{ data: Event[]; total: number; page: number; page_size: number }>(`/events?${query}`)
    },
    get: (id: string) => fetcher<Event>(`/events/${id}`),
  },
  auth: {
    login: (credentials: any) => fetcher<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (data: any) => fetcher<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },
  ai: {
    coachSearch: (query: string) => fetcher<{ data: Coach[]; total: number; note: string }>(`/ai/coach-search?query=${encodeURIComponent(query)}`),
    generateChapter: (data: { name: string; country: string }) => fetcher<any>('/ai/generate-chapter', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },
  payments: {
    createSession: (data: { program_id: string; email: string }) => fetcher<{ checkout_url: string; session_id: string }>('/payments/create-session', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  }
}
