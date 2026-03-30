import { useState } from 'react';
import { useApp } from '../store/AppContext';
import type { Idea } from '../types';
import IdeaCard from '../components/ideas/IdeaCard';

export default function Ideas() {
  const { state } = useApp();
  const [filter, setFilter] = useState({ domain: '', status: '', search: '', sort: 'votes' });

  const domains = Array.from(new Set<string>(state.ideas.map((i: Idea) => i.domain)));

  const filteredIdeas = state.ideas
    .filter((i: Idea) => !filter.domain || i.domain === filter.domain)
    .filter((i: Idea) => !filter.status || i.status === filter.status)
    .filter((i: Idea) => !filter.search || i.title.toLowerCase().includes(filter.search.toLowerCase()))
    .sort((a: Idea, b: Idea) => {
      if (filter.sort === 'votes') return b.totalVoteWeight - a.totalVoteWeight;
      if (filter.sort === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Browse Ideas <span style={{ fontSize: '14px', color: 'var(--text3)', fontWeight: 400 }}>({filteredIdeas.length})</span></div>
        <div className="page-desc">Explore, vote, and collaborate on ideas from the community</div>
      </div>

      <div className="idea-controls">
        <div className="ctrl-group">
          <span className="ctrl-label">Domain</span>
          <select value={filter.domain} onChange={e => setFilter({ ...filter, domain: e.target.value })}>
            <option value="">All Domains</option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="ctrl-group">
          <span className="ctrl-label">Status</span>
          <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="SELECTED">Selected</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <div className="ctrl-group">
          <span className="ctrl-label">Sort</span>
          <select value={filter.sort} onChange={e => setFilter({ ...filter, sort: e.target.value })}>
            <option value="votes">Most Votes</option>
            <option value="recent">Newest</option>
          </select>
        </div>
        <div className="ctrl-group">
          <input 
            type="text" 
            placeholder="Search…" 
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
            style={{ width: '180px' }}
          />
        </div>
      </div>

      <div className="ideas-grid">
        {filteredIdeas.map((idea: Idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
}
