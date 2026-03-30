import type { Idea, IdeaStatus, Application, UserProfile, AppPreferences, Toast, Notification } from '../types';
import { MOCK_IDEAS, DEFAULT_PROFILE, DEFAULT_PREFS, VOTE_THRESHOLD } from '../data/mockData';
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { ideaService } from '../services/api';

// ── STATE ─────────────────────────────────────────────────────────
interface AppState {
  ideas: Idea[];
  votedIds: Set<number>;
  appliedHackIds: Set<number>;
  applications: Application[];
  profile: UserProfile;
  prefs: AppPreferences;
  toasts: Toast[];
  notifications: Notification[];
  sidebarCollapsed: boolean;
  drawerIdeaId: number | null;
  submitModalOpen: boolean;
  applyModalHackId: number | null;
  profileModalOpen: boolean;
}

// ── ACTIONS ───────────────────────────────────────────────────────
type Action =
  | { type: 'SET_IDEAS'; ideas: Idea[] }
  | { type: 'VOTE'; id: number }
  | { type: 'UPDATE_STATUS'; id: number; status: IdeaStatus; rationale?: string }
  | { type: 'ADD_COMMENT'; id: number; author: string; text: string }
  | { type: 'ADD_IDEA'; idea: Idea }
  | { type: 'APPLY_HACK'; app: Application }
  | { type: 'SET_PROFILE'; profile: UserProfile }
  | { type: 'SET_PREFS'; prefs: Partial<AppPreferences> }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'ADD_NOTIF'; notif: Notification }
  | { type: 'CLEAR_NOTIFS' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'OPEN_DRAWER'; id: number }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'OPEN_SUBMIT_MODAL' }
  | { type: 'CLOSE_SUBMIT_MODAL' }
  | { type: 'OPEN_APPLY_MODAL'; hackId: number }
  | { type: 'CLOSE_APPLY_MODAL' }
  | { type: 'OPEN_PROFILE_MODAL' }
  | { type: 'CLOSE_PROFILE_MODAL' }
  | { type: 'CLEAR_VOTES' }
  | { type: 'CLEAR_APPLICATIONS' }
  | { type: 'RESET_ALL' };

// ── HELPERS ───────────────────────────────────────────────────────
function loadStorage<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

function initState(): AppState {
  const votedArr: number[] = loadStorage('hv-voted', []);
  const appliedArr: number[] = loadStorage('hv-applied', []);
  return {
    ideas: MOCK_IDEAS.map(i => ({ ...i, cmts: [] })),
    votedIds: new Set(votedArr),
    appliedHackIds: new Set(appliedArr),
    applications: loadStorage('hv-applications', []),
    profile: loadStorage('hv-profile', DEFAULT_PROFILE),
    prefs: loadStorage('hv-prefs', DEFAULT_PREFS),
    toasts: [],
    notifications: [
      { id: '1', type: 'select' as const, icon: '🏆', msg: 'Congratulations! Your idea "Vernacular STEM Learning" has been SELECTED for the finals!', time: new Date(Date.now() - 3600000).toISOString() },
      { id: '2', type: 'shortlist' as const, icon: '⭐', msg: 'Your idea "AI Resume Coach" has been shortlisted by the review committee.', time: new Date(Date.now() - 10800000).toISOString() },
      { id: '3', type: 'vote' as const, icon: '⚡', msg: 'Riya Mehta and 12 others voted on your idea "AI Resume Coach"', time: new Date(Date.now() - 18000000).toISOString() },
      { id: '4', type: 'comment' as const, icon: '💬', msg: 'Vikram Singh commented: "This could be huge for placement season..."', time: new Date(Date.now() - 28800000).toISOString() },
      { id: '5', type: 'application' as const, icon: '📋', msg: 'Your application to AI for Social Good 2026 has been shortlisted!', time: new Date(Date.now() - 43200000).toISOString() },
    ],
    sidebarCollapsed: false,
    drawerIdeaId: null,
    submitModalOpen: false,
    applyModalHackId: null,
    profileModalOpen: false,
  };
}

// ── REDUCER ───────────────────────────────────────────────────────
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_IDEAS':
      return { ...state, ideas: action.ideas };

    case 'VOTE': {
      const newVoted = new Set(state.votedIds);
      const newIdeas = state.ideas.map(i => {
        if (i.id !== action.id) return i;
        if (newVoted.has(action.id)) {
          newVoted.delete(action.id);
          return { ...i, totalVoteWeight: i.totalVoteWeight - 1, recentVotesLastHour: Math.max(0, i.recentVotesLastHour - 1) };
        } else {
          newVoted.add(action.id);
          const updated = { ...i, totalVoteWeight: i.totalVoteWeight + 1, recentVotesLastHour: i.recentVotesLastHour + 1 };
          if (updated.status === 'SUBMITTED' && updated.totalVoteWeight >= VOTE_THRESHOLD) {
            return { ...updated, status: 'SHORTLISTED' as IdeaStatus };
          }
          return updated;
        }
      });
      localStorage.setItem('hv-voted', JSON.stringify([...newVoted]));
      return { ...state, votedIds: newVoted, ideas: newIdeas };
    }

    case 'UPDATE_STATUS':
      return {
        ...state,
        ideas: state.ideas.map(i =>
          i.id === action.id
            ? { ...i, status: action.status, rationale: action.rationale ?? i.rationale }
            : i
        ),
      };

    case 'ADD_COMMENT':
      return {
        ...state,
        ideas: state.ideas.map(i =>
          i.id === action.id
            ? { ...i, cmts: [...i.cmts, { u: action.author, t: action.text }] }
            : i
        ),
      };

    case 'ADD_IDEA':
      return { ...state, ideas: [action.idea, ...state.ideas] };

    case 'APPLY_HACK': {
      const newApplied = new Set(state.appliedHackIds);
      newApplied.add(action.app.hackId);
      const newApps = [...state.applications, action.app];
      localStorage.setItem('hv-applied', JSON.stringify([...newApplied]));
      localStorage.setItem('hv-applications', JSON.stringify(newApps));
      return { ...state, appliedHackIds: newApplied, applications: newApps };
    }

    case 'SET_PROFILE':
      localStorage.setItem('hv-profile', JSON.stringify(action.profile));
      return { ...state, profile: action.profile };

    case 'SET_PREFS': {
      const np = { ...state.prefs, ...action.prefs };
      localStorage.setItem('hv-prefs', JSON.stringify(np));
      if (action.prefs.accent) {
        document.documentElement.style.setProperty('--accent', action.prefs.accent);
        document.documentElement.style.setProperty('--accent-dim', action.prefs.accent + '1a');
      }
      return { ...state, prefs: np };
    }

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };

    case 'ADD_NOTIF':
      return { ...state, notifications: [action.notif, ...state.notifications].slice(0, 50) };

    case 'CLEAR_NOTIFS':
      return { ...state, notifications: [] };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'OPEN_DRAWER':
      return { ...state, drawerIdeaId: action.id };

    case 'CLOSE_DRAWER':
      return { ...state, drawerIdeaId: null };

    case 'OPEN_SUBMIT_MODAL':
      return { ...state, submitModalOpen: true };

    case 'CLOSE_SUBMIT_MODAL':
      return { ...state, submitModalOpen: false };

    case 'OPEN_APPLY_MODAL':
      return { ...state, applyModalHackId: action.hackId };

    case 'CLOSE_APPLY_MODAL':
      return { ...state, applyModalHackId: null };

    case 'OPEN_PROFILE_MODAL':
      return { ...state, profileModalOpen: true };

    case 'CLOSE_PROFILE_MODAL':
      return { ...state, profileModalOpen: false };

    case 'RESET_ALL':
      localStorage.clear();
      return initState();

    default:
      return state;
  }
}

// ── CONTEXT ───────────────────────────────────────────────────────
export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  toast: (message: string, type?: Toast['type']) => void;
  pushNotif: (type: Notification['type'], msg: string, icon?: string) => void;
  vote: (id: number) => void;
  openIdea: (id: number) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  // Initial fetch
  useEffect(() => {
    ideaService.getAll().then(data => {
      if (data) dispatch({ type: 'SET_IDEAS', ideas: data.map(i => ({ ...i, cmts: [] })) });
    });
  }, []);

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    dispatch({ type: 'ADD_TOAST', toast: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 3500);
  }, []);

  const pushNotif = useCallback((type: Notification['type'], msg: string, icon?: string) => {
    const defaultIcons: Record<string, string> = {
      vote: '⚡',
      select: '🏆',
      comment: '💬',
      shortlist: '⭐',
      application: '📋'
    };
    dispatch({ 
      type: 'ADD_NOTIF', 
      notif: { 
        id: Date.now().toString(), 
        type, 
        msg, 
        time: new Date().toISOString(),
        icon: icon || defaultIcons[type] || '🔔',
        read: false
      } 
    });
  }, []);

  const vote = useCallback((id: number) => {
    const isVoted = state.votedIds.has(id);
    dispatch({ type: 'VOTE', id });
    
    if (isVoted) {
      ideaService.removeVote(id, state.profile.userId);
      toast('Vote removed', 'info');
    } else {
      ideaService.castVote(id, state.profile.userId);
      toast('Vote cast! 👍', 'success');
      pushNotif('vote', `Upvoted idea #${id}`);
    }
  }, [state.votedIds, state.profile.userId, toast, pushNotif]);

  const openIdea = useCallback((id: number) => {
    dispatch({ type: 'OPEN_DRAWER', id });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, toast, pushNotif, vote, openIdea }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);
