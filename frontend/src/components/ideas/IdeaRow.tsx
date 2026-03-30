import type { Idea } from '../../types';
import { STATUS_ICONS, STATUS_LABEL } from '../../data/constants';
import { useApp } from '../../store/AppContext';

export default function IdeaRow({ idea }: { idea: Idea }) {
  const { openIdea } = useApp();

  return (
    <div className="idea-row" onClick={() => openIdea(idea.id)}>
      <div className="idea-row-info">
        <div className="idea-row-title">{idea.title}</div>
        <div className="idea-row-meta">
          <span className="badge-domain">{idea.domain}</span>
          <span>{idea.createdByName}</span>
          {idea.recentVotesLastHour > 0 && <span className="hot-pill">⚡ {idea.recentVotesLastHour}/h</span>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        <span className={`badge badge-${idea.status}`}>
          {STATUS_ICONS[idea.status]} {STATUS_LABEL[idea.status]}
        </span>
        <div className="score-chip">▲ {idea.totalVoteWeight}</div>
      </div>
    </div>
  );
}
