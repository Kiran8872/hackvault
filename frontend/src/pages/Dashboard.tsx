import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import StatCard from '../components/ui/StatCard';
import Panel from '../components/ui/Panel';
import IdeaRow from '../components/ideas/IdeaRow';
import HackathonCard from '../components/hackathons/HackathonCard';
import SkeletonIdeaRow from '../components/ui/Skeleton';
import { HACKATHONS, MOCK_TRENDS } from '../data/mockData';
import type { Idea } from '../types';

export default function Dashboard() {
  const { state, openIdea } = useApp();
  const navigate = useNavigate();

  const totalVotes = state.ideas.reduce((acc: number, i: Idea) => acc + (i.recentVotesLastHour || 0), 0);
  const submitted = state.ideas.filter((i: Idea) => i.status === 'SUBMITTED').length;
  const shortlisted = state.ideas.filter((i: Idea) => i.status === 'SHORTLISTED').length;
  const selected = state.ideas.filter((i: Idea) => i.status === 'SELECTED').length;

  const trending = [...state.ideas].sort((a: Idea, b: Idea) => b.recentVotesLastHour - a.recentVotesLastHour).slice(0, 5);
  const topShortlisted = state.ideas
    .filter((i: Idea) => i.status === 'SHORTLISTED' || i.status === 'SELECTED')
    .sort((a: Idea, b: Idea) => b.totalVoteWeight - a.totalVoteWeight)
    .slice(0, 4);

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Mission Control</div>
        <div className="page-desc">Live overview of ideas, hackathons, and community activity</div>
      </div>

      <div className="stat-grid">
        <StatCard icon="💡" value={state.ideas.length} label="Total Ideas" sub="across all domains" color="var(--accent)" />
        <StatCard icon="📥" value={submitted} label="Submitted" sub="pending review" color="var(--blue)" />
        <StatCard icon="⭐" value={shortlisted} label="Shortlisted" sub="made the cut" color="var(--gold)" />
        <StatCard icon="🏆" value={selected} label="Selected" sub="winners" color="var(--accent)" />
        <StatCard icon="⚡" value={totalVotes} label="Votes/Hour" sub="live activity" color="var(--purple)" />
      </div>

      <div className="dash-cols">
        <div>
          <Panel 
            title="Trending Ideas" 
            action={<button className="btn btn-ghost btn-sm" onClick={() => navigate('/ideas')}>View all →</button>}
          >
            {trending.length > 0 ? (
              trending.map((idea: Idea) => (
                <IdeaRow key={idea.id} idea={idea} />
              ))
            ) : (
              <>
                <SkeletonIdeaRow />
                <SkeletonIdeaRow />
                <SkeletonIdeaRow />
              </>
            )}
          </Panel>

          <Panel 
            title="Active Hackathons" 
            iconColor="var(--gold)"
            action={<button className="btn btn-ghost btn-sm" onClick={() => navigate('/hackathons')}>Browse →</button>}
          >
             {HACKATHONS.filter(h => h.status !== 'past').slice(0, 3).map(h => (
               <HackathonCard key={h.id} hack={h} onClick={() => navigate('/hackathons')} />
             ))}
          </Panel>
        </div>

        <div>
          <Panel
            title="Top Shortlisted"
            action={<button className="btn btn-ghost btn-sm" onClick={() => navigate('/shortlist')}>View all →</button>}
          >
            {topShortlisted.length > 0 ? (
              topShortlisted.map((idea: Idea, idx: number) => (
                <div key={idea.id} className="idea-row" onClick={() => openIdea(idea.id)} style={{ cursor: 'pointer', marginBottom: '8px' }}>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: '18px', fontWeight: 800, color: idx === 0 ? 'var(--gold)' : 'var(--text3)', width: '24px', textAlign: 'center' }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{idea.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{idea.domain} · {idea.totalVoteWeight} votes</div>
                  </div>
                  <span className={`badge badge-${idea.status}`}>{idea.status === 'SELECTED' ? '🏆 Selected' : '⭐ Shortlisted'}</span>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ padding: '30px' }}>
                <div className="empty-icon">⭐</div>
                <div className="empty-title">No shortlisted ideas yet</div>
              </div>
            )}
          </Panel>

          <Panel title="Domain Activity">
            {MOCK_TRENDS.slice(0, 4).map(t => (
              <div key={t.domain} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{t.domain}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{t.ideasCount} ideas · {t.voteWeight} votes</div>
                </div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>{t.growth}</div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}
