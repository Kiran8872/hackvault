import { useState } from 'react';
import { HACKATHONS } from '../data/mockData';
import HackathonCard from '../components/hackathons/HackathonCard';
import type { Hackathon } from '../types';
import { useApp } from '../store/AppContext';

export default function Hackathons() {
  const { dispatch, state } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedHack, setSelectedHack] = useState<Hackathon | null>(null);

  const filtered = HACKATHONS.filter(h => {
    if (filter === 'all') return true;
    return h.status === filter;
  });

  const isApplied = selectedHack ? state.appliedHackIds.has(selectedHack.id) : false;

  if (selectedHack) {
    return (
       <div className="page active">
          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedHack(null)} style={{ marginBottom: '16px' }}>← Back to Hackathons</button>
          
          <div className="hack-detail-hero" style={{ background: selectedHack.color }}>
            <div className="hack-detail-hero-content">
              <div className="hack-detail-emoji">{selectedHack.emoji}</div>
              <div className="hack-detail-title">{selectedHack.title}</div>
              <div className="hack-detail-org">{selectedHack.org}</div>
              <div style={{ marginTop: '12px' }}>
                <span className={`hack-badge-live ${selectedHack.status}`}>{selectedHack.status.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="hack-detail-row">
            <div className="hack-detail-main">
              <div className="section-card">
                <div className="section-card-title">📋 Event Description</div>
                <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>{selectedHack.desc}</div>
              </div>
              
              <div className="section-card">
                <div className="section-card-title">📜 Rules & Guidelines</div>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedHack.rules.map((rule, id) => (
                    <li key={id} style={{ fontSize: '13px', color: 'var(--text2)' }}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="section-card">
                <div className="section-card-title">🗓️ Event Timeline</div>
                <div className="timeline-list">
                  {selectedHack.timeline.map((item, id) => (
                    <div key={id} className="timeline-item">
                       <div className={`timeline-dot ${item.done ? 'done' : ''}`}></div>
                       <div>
                         <div className="timeline-time">{item.time}</div>
                         <div className="timeline-label">{item.label}</div>
                         <div className="timeline-sub">{item.sub}</div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section-card">
                <div className="section-card-title">❔ Frequently Asked Questions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedHack.faqs.map((faq, id) => (
                    <div key={id}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>Q: {faq.q}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text2)' }}>A: {faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="hack-apply-sidebar">
               <div className="section-card">
                 <div className="apply-sidebar-title" style={{ fontSize: '12px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '8px' }}>Prize Pool</div>
                 <div className="apply-prize-big" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--gold)', marginBottom: '20px' }}>{selectedHack.prize}</div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text2)' }}>👥 {selectedHack.participants} / {selectedHack.spots} participants</div>
                    <div style={{ fontSize: '12px', color: 'var(--text2)' }}>📅 Ends {selectedHack.end}</div>
                 </div>

                 {isApplied ? (
                   <div style={{ background: 'var(--accent-dim)', color: 'var(--accent)', padding: '12px', borderRadius: 'var(--r)', textAlign: 'center', fontWeight: '700', fontSize: '13px', border: '1px solid rgba(0,200,150,.3)' }}>
                     ✅ Application Submitted
                   </div>
                 ) : (
                   <button 
                    className="btn btn-gold btn-lg" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => dispatch({ type: 'OPEN_APPLY_MODAL', hackId: selectedHack.id })}
                    disabled={selectedHack.status === 'past'}
                   >
                     🚀 Apply Now
                   </button>
                 )}
               </div>
            </div>
          </div>
       </div>
    );
  }

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">Hackathons</div>
        <div className="page-desc">Discover and apply to active challenges from top organizations</div>
      </div>

      <div className="hack-filters" style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter('all')}>All</button>
        <button className={`btn ${filter === 'live' ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter('live')}>🟢 Live</button>
        <button className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter('upcoming')}>🔵 Upcoming</button>
        <button className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter('past')}>Past</button>
      </div>

      <div className="hackathons-grid">
        {filtered.map(h => (
          <HackathonCard key={h.id} hack={h} onClick={() => setSelectedHack(h)} />
        ))}
      </div>
    </div>
  );
}
