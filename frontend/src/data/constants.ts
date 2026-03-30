import type { IdeaStatus } from '../types';

export const STATUS_ICONS: Record<IdeaStatus, string> = {
  SUBMITTED: '📥',
  SHORTLISTED: '⭐',
  SELECTED: '🏆',
  ARCHIVED: '📦'
};

export const STATUS_LABEL: Record<IdeaStatus, string> = {
  SUBMITTED: 'Submitted',
  SHORTLISTED: 'Shortlisted',
  SELECTED: 'Selected',
  ARCHIVED: 'Archived'
};
