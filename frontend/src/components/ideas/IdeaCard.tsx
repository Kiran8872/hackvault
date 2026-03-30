import { useApp } from '../../store/AppContext';
import type { Idea } from '../../types';
import { STATUS_ICONS, STATUS_LABEL } from '../../data/constants';
import Badge from '../ui/Badge';

interface IdeaCardProps {
  idea: Idea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const { vote, openIdea, state } = useApp();
  const isVoted = state.votedIds.has(idea.id);

  return (
    <div className={`idea-card ${idea.status === 'SELECTED' ? 'sel' : ''} ${idea.status === 'SHORTLISTED' ? 'shortlisted-card' : ''}`} onClick={() => openIdea(idea.id)}>
      {idea.status === 'SELECTED' && (
        <div className="sel-bar">
          <span className="sel-icon">🏆</span> Confirmed for Build Sprint
        </div>
      )}
      
      <div className="idea-hd">
        <div className="vote-col" onClick={(e) => { e.stopPropagation(); vote(idea.id); }}>
          <button className={`upvote ${isVoted ? 'voted' : ''}`}>▲</button>
          <div className="vnum">{idea.totalVoteWeight}</div>
          <div className="vlbl">VOTES</div>
        </div>
        
        <div className="idea-body">
          <div className="idea-title-text">{idea.title}</div>
          <div className="idea-meta">
            <Badge type="domain">{idea.domain}</Badge>
            <span>by {idea.createdByName}</span>
          </div>
          <div className="idea-desc">{idea.description}</div>
          <div className="tags">
            {idea.tags.map(tag => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>
          <div className="idea-actions">
            <span className={`badge badge-${idea.status}`}>
               {STATUS_ICONS[idea.status]} {STATUS_LABEL[idea.status]}
            </span>
            {idea.recentVotesLastHour > 0 && <span className="hot-pill">⚡ {idea.recentVotesLastHour}/h</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
