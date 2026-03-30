export type IdeaStatus = 'SUBMITTED' | 'SHORTLISTED' | 'SELECTED' | 'ARCHIVED';

export interface Comment {
  u: string;
  t: string;
}

export interface HistoryEntry {
  status: IdeaStatus;
  rationale?: string;
  changedBy: string;
  at: string;
}

export interface Idea {
  id: number;
  title: string;
  domain: string;
  description: string;
  status: IdeaStatus;
  totalVoteWeight: number;
  recentVotesLastHour: number;
  voteHistory: number[];
  createdByUserId: number;
  createdByName: string;
  hackathonId?: number;
  rationale?: string;
  tags: string[];
  createdAt: string;
  cmts: Comment[];
}

export interface TimelineItem {
  time: string;
  label: string;
  sub: string;
  done: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export type HackathonStatus = 'live' | 'upcoming' | 'past';

export interface Hackathon {
  id: number;
  title: string;
  org: string;
  status: HackathonStatus;
  domain: string;
  desc: string;
  prize: string;
  participants: number;
  spots: number;
  start: string;
  end: string;
  tags: string[];
  emoji: string;
  color: string;
  accent: string;
  rules: string[];
  timeline: TimelineItem[];
  faqs: FaqItem[];
}

export interface Contributor {
  userId: number;
  userName: string;
  role: string;
  ideasSubmitted: number;
  votesCast: number;
  commentsPosted: number;
  score: number;
}

export interface TrendData {
  domain: string;
  ideasCount: number;
  voteWeight: number;
  recentVotesLastHour: number;
  growth: string;
}

export interface UserProfile {
  name: string;
  email: string;
  userId: number;
  skills: string;
  handle: string;
  bio: string;
}

export type ApplicationStage = 'applied' | 'reviewed' | 'shortlisted' | 'confirmed' | 'rejected';

export interface Application {
  hackId: number;
  hackTitle: string;
  hackOrg: string;
  hackEmoji: string;
  stage: ApplicationStage;
  appliedAt: string;
  name: string;
  email: string;
  role: string;
  team?: string;
  teamEmails?: string;
  pitch?: string;
  url?: string;
  note?: string;
}

export interface Notification {
  id: string;
  type: 'vote' | 'select' | 'comment' | 'shortlist' | 'application';
  msg: string;
  time: string;
  read?: boolean;
  icon?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface DashboardData {
  totalIdeas: number;
  submittedIdeas: number;
  shortlistedIdeas: number;
  selectedIdeas: number;
  archivedIdeas: number;
  totalVotesLastHour: number;
}

export interface ApplyFormData {
  name: string;
  email: string;
  role: string;
  team: string;
  teamEmails: string;
  pitch: string;
  url: string;
}

export type Density = 'comfortable' | 'compact';
export type AccentColor = string;

export interface AppPreferences {
  accent: AccentColor;
  density: Density;
  notifVotes: boolean;
  notifComments: boolean;
  notifStatus: boolean;
  notifApplications: boolean;
  notifLive: boolean;
  privLeaderboard: boolean;
  privVotes: boolean;
  privEmail: boolean;
}
