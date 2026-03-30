import { useState } from 'react';
import { HACKATHONS } from '../../data/mockData';
import { useApp } from '../../store/AppContext';

export function ApplyModal() {
  const { state, dispatch, toast, pushNotif } = useApp();
  const hack = HACKATHONS.find(h => h.id === state.applyModalHackId);
  const [form, setForm] = useState({ 
    name: state.profile.name, 
    email: state.profile.email, 
    role: 'Developer', 
    teamName: '', 
    teamEmails: '', 
    pitch: '', 
    github: '' 
  });

  if (!state.applyModalHackId || !hack) return null;

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.pitch) return toast('Please fill in required fields', 'error');

    dispatch({
      type: 'APPLY_HACK',
      app: {
        hackId: hack.id,
        hackTitle: hack.title,
        hackOrg: hack.org,
        hackEmoji: hack.emoji,
        stage: 'applied',
        appliedAt: new Date().toISOString(),
        name: form.name,
        email: form.email,
        role: form.role,
        team: form.teamName,
        teamEmails: form.teamEmails,
        pitch: form.pitch,
        url: form.github
      }
    });
    dispatch({ type: 'CLOSE_APPLY_MODAL' });
    toast('Application submitted successfully! 🚀');
    pushNotif('select', `Applied for ${hack.title} as ${form.role}`);
  };

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">🏆 Apply to Participate</div>
          <div className="drawer-close" onClick={() => dispatch({ type: 'CLOSE_APPLY_MODAL' })}>✕</div>
        </div>
        <div className="modal-body">
           <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Your Role *</label>
            <select className="form-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="Developer">Developer (Frontend/Backend/Fullstack)</option>
              <option value="Designer">UI/UX Designer</option>
              <option value="AI Engineer">AI/ML Engineer</option>
              <option value="Researcher">Domain Researcher</option>
              <option value="Student">Student / Beginner</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Team Name (Optional)</label>
              <input className="form-input" placeholder="e.g. Pixel Wizards" value={form.teamName} onChange={e => setForm({...form, teamName: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub / Portfolio URL</label>
              <input className="form-input" placeholder="https://..." value={form.github} onChange={e => setForm({...form, github: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Project Idea Pitch *</label>
            <textarea className="form-textarea" placeholder="Describe what you plan to build..." style={{ minHeight: '80px' }} value={form.pitch} onChange={e => setForm({...form, pitch: e.target.value})} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'CLOSE_APPLY_MODAL' })}>Cancel</button>
          <button className="btn btn-gold" onClick={handleSubmit}>🚀 Submit Application</button>
        </div>
      </div>
    </div>
  );
}
