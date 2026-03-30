import { useApp } from '../store/AppContext';
import type { Idea } from '../types';
import IdeaCard from '../components/ideas/IdeaCard';

export default function Shortlist() {
  const { state } = useApp();
  
  const shortlisted = state.ideas.filter((i: Idea) => i.status === 'SHORTLISTED' || i.status === 'SELECTED');

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Shortlist</div>
        <div className="page-desc">Ideas that cleared the vote threshold — selected for build sprints</div>
      </div>

      <div className="ideas-grid">
        {shortlisted.map((idea: Idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
}
