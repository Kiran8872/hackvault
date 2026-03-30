import { MOCK_CONTRIBUTORS } from '../data/mockData';

export default function Contributors() {
  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Leaderboard</div>
        <div className="page-desc">Top contributors ranked by ideas, votes, and discussion activity</div>
      </div>

      <div className="contrib-grid">
        {MOCK_CONTRIBUTORS.map((c, idx) => (
          <div key={c.userId} className="contrib-card">
            <div className={`contrib-rank ${idx === 0 ? 'gold-rank' : idx === 1 ? 'silver-rank' : idx === 2 ? 'bronze-rank' : ''}`}>
              {idx + 1}
            </div>
            <div className="contrib-info">
              <div className="contrib-name">{c.userName}</div>
              <div className="contrib-role">{c.role}</div>
            </div>
            <div className="contrib-stats">
              <div className="contrib-stat">
                <div className="contrib-stat-val">{c.ideasSubmitted}</div>
                <div className="contrib-stat-lbl">IDEAS</div>
              </div>
              <div className="contrib-stat">
                <div className="contrib-stat-val">{c.votesCast}</div>
                <div className="contrib-stat-lbl">VOTES</div>
              </div>
            </div>
            <div className="contrib-score">
              {c.score}
              <div className="contrib-score-lbl">SCORE</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
