export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Public content
  getPageContent: (slug: string) => request(`/pages/${slug}`),
  getChapters: () => request("/chapters"),
  getChapter: (slug: string) => request(`/chapters/${slug}`),
  getChapterTeam: (slug: string) => request(`/chapters/${slug}/team`),
  getChapterCoaches: (slug: string) => request(`/chapters/${slug}/coaches`),
  getChapterEvents: (slug: string) => request(`/chapters/${slug}/events`),
  getChapterResources: (slug: string) => request(`/chapters/${slug}/resources`),
  getChapterTestimonials: (slug: string) => request(`/chapters/${slug}/testimonials`),
  getCoaches: (query = "") => request(`/coaches${query ? `?${query}` : ""}`),
  getEvents: (query = "") => request(`/events${query ? `?${query}` : ""}`),
  getResources: (query = "") => request(`/resources${query ? `?${query}` : ""}`),
  sendContactMessage: (payload: unknown) =>
    request("/contact", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  sendChapterContactMessage: (slug: string, payload: unknown) =>
    request(`/chapters/${slug}/contact`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  // Auth and session
  login: (payload: unknown) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  logout: () =>
    request("/auth/logout", {
      method: "POST"
    }),
  getSession: () => request("/auth/session"),
  getCurrentUser: () => request("/me"),

  // Coach account
  getMyCoachProfile: () => request("/me/coach-profile"),
  updateMyCoachProfile: (payload: unknown) =>
    request("/me/coach-profile", {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  getMyCertification: () => request("/me/certification"),

  // Chapter leader workspace
  getChapterWorkspace: (slug: string) => request(`/portal/chapters/${slug}`),
  updateChapterContent: (slug: string, payload: unknown) =>
    request(`/portal/chapters/${slug}/content`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  updateChapterContact: (slug: string, payload: unknown) =>
    request(`/portal/chapters/${slug}/contact`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  createChapterEvent: (slug: string, payload: unknown) =>
    request(`/portal/chapters/${slug}/events`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateChapterEvent: (slug: string, eventId: string, payload: unknown) =>
    request(`/portal/chapters/${slug}/events/${eventId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  createChapterResource: (slug: string, payload: unknown) =>
    request(`/portal/chapters/${slug}/resources`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateChapterResource: (slug: string, resourceId: string, payload: unknown) =>
    request(`/portal/chapters/${slug}/resources/${resourceId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),

  // Global admin workspace
  getPortalOverview: () => request("/portal/overview"),
  getPendingApprovals: () => request("/portal/approvals"),
  updateGlobalPage: (slug: string, payload: unknown) =>
    request(`/portal/pages/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    })
};
