import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { HACKATHONS } from '../../data/mockData';
import { ideaService } from '../../services/api';

export function SubmitIdeaModal() {
  const { state, dispatch, toast, pushNotif } = useApp();
  const [form, setForm] = useState({ title: '', domain: '', hackId: '', desc: '', tags: '' });
  const [loading, setLoading] = useState(false);

  if (!state.submitModalOpen) return null;

  const handleSubmit = async () => {
    if (!form.title || !form.domain || !form.desc) return toast('Please fill in required fields', 'error');
    
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        domain: form.domain,
        description: form.desc,
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
        createdByUserId: state.profile.userId
      };

      const result = await ideaService.create(payload);
      
      if (result) {
        dispatch({ type: 'ADD_IDEA', idea: { ...result, cmts: [] } });
        dispatch({ type: 'CLOSE_SUBMIT_MODAL' });
        toast('Idea submitted successfully!', 'success');
        pushNotif('select', `You submitted a new idea: "${form.title}"`);
      } else {
        throw new Error('Fallback to local');
      }
    } catch {
      // Fallback for demo when backend is offline
      const fallback = {
        id: Date.now(),
        title: form.title,
        domain: form.domain,
        description: form.desc,
        status: 'SUBMITTED' as const,
        totalVoteWeight: 1,
        recentVotesLastHour: 1,
        createdByUserId: state.profile.userId,
        createdByName: state.profile.name,
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
        createdAt: new Date().toISOString(),
        cmts: []
      };
      dispatch({ type: 'ADD_IDEA', idea: fallback });
      dispatch({ type: 'CLOSE_SUBMIT_MODAL' });
      toast('Submitted (Local Sync Only)', 'info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">✦ Submit a New Idea</div>
          <div className="drawer-close" onClick={() => dispatch({ type: 'CLOSE_SUBMIT_MODAL' })}>✕</div>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Idea Title *</label>
            <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="What's your vision?" disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Domain *</label>
            <input className="form-input" value={form.domain} onChange={e => setForm({...form, domain: e.target.value})} placeholder="e.g. AI/ML..." disabled={loading} />
          </div>
          <div className="form-group">
            <label className="form-label">Target Hackathon (Optional)</label>
            <select className="form-select" value={form.hackId} onChange={e => setForm({...form, hackId: e.target.value})} disabled={loading}>
              <option value="">None / Open Innovation</option>
              {HACKATHONS.map(h => <option key={h.id} value={h.id}>{h.emoji} {h.title}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder="Explain your concept..." style={{ minHeight: '100px' }} disabled={loading} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'CLOSE_SUBMIT_MODAL' })} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Idea →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfileModal() {
  const { state, dispatch, toast } = useApp();
  const [name, setName] = useState(state.profile.name);

  if (!state.profileModalOpen) return null;

  const handleSave = () => {
    dispatch({ type: 'SET_PROFILE', profile: { ...state.profile, name } });
    dispatch({ type: 'CLOSE_PROFILE_MODAL' });
    toast('Profile updated locally');
  };

  return (
    <div className="modal-overlay open">
      <div className="modal" style={{ maxWidth: '440px' }}>
        <div className="modal-head">
          <div className="modal-title">Edit Profile</div>
          <div className="drawer-close" onClick={() => dispatch({ type: 'CLOSE_PROFILE_MODAL' })}>✕</div>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'CLOSE_PROFILE_MODAL' })}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
