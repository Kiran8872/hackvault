import type { Hackathon } from '../../types';
import Badge from '../ui/Badge';

interface HackathonCardProps {
  hack: Hackathon;
  onClick: (id: number) => void;
}

export default function HackathonCard({ hack, onClick }: HackathonCardProps) {
  const progress = Math.min(100, Math.round((hack.participants / hack.spots) * 100));

  return (
    <div className="hack-card" onClick={() => onClick(hack.id)}>
      <div className="hack-card-bg" style={{ background: hack.color }}>
        <div className="hack-card-content">
          <div className="hack-emoji">{hack.emoji}</div>
          <div className="hack-title">{hack.title}</div>
          <div className="hack-org">{hack.org}</div>
        </div>
      </div>
      <div className="hack-card-body">
        <div className="hack-meta">
          <div className="hack-meta-item">📅 {hack.start}</div>
          <div className="hack-meta-item">🏆 {hack.prize}</div>
        </div>
        <div className="hack-tags">
          {hack.tags.map(tag => <Badge key={tag} type="domain">{tag}</Badge>)}
        </div>
        <div className="hack-footer">
          <div className="hack-progress-wrap">
            <div className="hack-progress-label">
              <span>{hack.participants} / {hack.spots} joined</span>
              <span>{progress}%</span>
            </div>
            <div className="hack-progress-track">
              <div className="hack-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <span className={`hack-badge-live ${hack.status}`}>
            {hack.status === 'live' ? 'Live' : hack.status === 'upcoming' ? 'Upcoming' : 'Past'}
          </span>
        </div>
      </div>
    </div>
  );
}
