import type { Idea, DashboardData, Contributor, TrendData, UserProfile } from '../types';
const API = 'http://localhost:8080';

export async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(API + path, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    });
    if (!res.ok) throw new Error(res.statusText);
    if (res.status === 204) return null as T;
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`API Error (${path}):`, err);
    return null;
  }
}

export const ideaService = {
  getAll: () => apiFetch<Idea[]>('/api/ideas'),
  getDashboard: () => apiFetch<DashboardData>('/api/ideas/dashboard'),
  getContributors: () => apiFetch<Contributor[]>('/api/ideas/contributors'),
  getTrends: () => apiFetch<TrendData[]>('/api/ideas/trends/domains'),
  
  // Matches castVote(@PathVariable Long ideaId, @Valid @RequestBody CastVoteRequest request)
  // CastVoteRequest { Long userId; }
  castVote: (ideaId: number, userId: number) =>
    apiFetch<unknown>(`/api/ideas/${ideaId}/votes`, { 
      method: 'POST', 
      body: JSON.stringify({ userId }) 
    }),

  removeVote: (ideaId: number, userId: number) =>
    apiFetch<unknown>(`/api/ideas/${ideaId}/votes/${userId}`, { method: 'DELETE' }),

  // Matches updateStatus(@PathVariable Long ideaId, @Valid @RequestBody UpdateIdeaStatusRequest request)
  // UpdateIdeaStatusRequest { Long moderatorUserId; IdeaStatus status; String rationale; }
  updateStatus: (ideaId: number, status: string, rationale: string, userId: number) =>
    apiFetch<unknown>(`/api/ideas/${ideaId}/status`, { 
      method: 'PATCH', 
      body: JSON.stringify({ 
        moderatorUserId: userId, 
        status, 
        rationale 
      }) 
    }),

  // Matches addComment(@PathVariable Long ideaId, @Valid @RequestBody AddCommentRequest request)
  // AddCommentRequest { Long userId; String content; }
  postComment: (ideaId: number, userId: number, content: string) =>
    apiFetch<unknown>(`/api/ideas/${ideaId}/comments`, { 
      method: 'POST', 
      body: JSON.stringify({ 
        userId, 
        content 
      }) 
    }),

  getComments: (ideaId: number) => apiFetch<unknown[]>(`/api/ideas/${ideaId}/comments`),

  // Matches createIdea(@Valid @RequestBody CreateIdeaRequest request)
  // CreateIdeaRequest { String title; String domain; String description; List<String> tags; Long createdByUserId; }
  create: (idea: Partial<Idea>) =>
    apiFetch<Idea>('/api/ideas', { 
      method: 'POST', 
      body: JSON.stringify({
        title: idea.title,
        domain: idea.domain,
        description: idea.description,
        tags: idea.tags || [],
        createdByUserId: idea.createdByUserId
      }) 
    }),
};

export const userService = {
  getAll: () => apiFetch<UserProfile[]>('/api/users'),
  create: (name: string) => apiFetch<UserProfile>('/api/users', { 
    method: 'POST', 
    body: JSON.stringify({ name }) 
  }),
};
