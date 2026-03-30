import { useState, useRef, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import type { Notification } from '../../types';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

const NOTIF_COLORS: Record<string, string> = {
  select: 'var(--gold)',
  shortlist: 'var(--gold)',
  vote: 'var(--accent)',
  comment: 'var(--text3)',
  application: 'var(--blue)',
};

export default function Topbar() {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return { t: 'Dashboard', c: 'HackVault / overview' };
      case '/hackathons': return { t: 'Hackathons', c: 'HackVault / discover' };
      case '/ideas': return { t: 'Browse Ideas', c: 'HackVault / ideas' };
      case '/shortlist': return { t: 'Shortlist', c: 'HackVault / shortlisted' };
      case '/my-applications': return { t: 'My Applications', c: 'HackVault / tracker' };
      case '/contributors': return { t: 'Leaderboard', c: 'HackVault / community' };
      case '/trends': return { t: 'Domain Trends', c: 'HackVault / analytics' };
      case '/notifications': return { t: 'Notifications', c: 'HackVault / activity' };
      case '/settings': return { t: 'Settings', c: 'HackVault / preferences' };
      default: return { t: 'HackVault', c: 'HackVault / app' };
    }
  };

  const { t, c } = getTitle();
  const unreadCount = state.notifications.filter((n: Notification) => !n.read).length;

  return (
    <header className="topbar glass">
      <div className="mobile-only" onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} style={{ marginRight: '16px', cursor: 'pointer', fontSize: '18px' }}>☰</div>
      
      <div>
        <div className="page-heading">{t}</div>
        <div className="breadcrumb">{c}</div>
      </div>
      
      <div className="topbar-right">
        <div className="search-box hide-on-mobile">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search ideas, hackathons…" />
        </div>
        
        <button className="btn btn-primary btn-sm" onClick={() => dispatch({ type: 'OPEN_SUBMIT_MODAL' })}>+ Submit Idea</button>
        
        {/* ── Notification Bell ──────────────────────────── */}
        <div className="notif-bell-wrap" ref={notifRef}>
          <button className="notif-btn" onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="notif-panel glass">
              <div className="notif-panel-header">
                <div className="notif-panel-title">Notifications</div>
                <div className="notif-panel-actions">
                  <button className="notif-mark-read" onClick={() => dispatch({ type: 'CLEAR_NOTIFS' })}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Mark all read
                  </button>
                  <button className="notif-close" onClick={() => setNotifOpen(false)}>✕</button>
                </div>
              </div>
              <div className="notif-panel-body">
                {state.notifications.length === 0 ? (
                  <div className="notif-empty">
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔔</div>
                    <div style={{ fontSize: '13px', color: 'var(--text2)' }}>You're all caught up!</div>
                  </div>
                ) : (
                  state.notifications.map((n: Notification) => (
                    <div key={n.id} className={`notif-panel-item ${n.type} ${n.read ? 'read' : ''}`}>
                      <div className="notif-panel-icon" style={{ borderColor: NOTIF_COLORS[n.type] || 'var(--border)' }}>
                        {n.icon || '🔔'}
                      </div>
                      <div className="notif-panel-content">
                        <div className="notif-panel-msg">{n.msg}</div>
                        <div className="notif-panel-time">{timeAgo(n.time)}</div>
                      </div>
                      {!n.read && <div className="notif-unread-dot"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="topbar-divider"></div>

        {/* ── Profile Dropdown ──────────────────────────── */}
        <div className={`topbar-profile ${dropdownOpen ? 'open' : ''}`} ref={profileRef} onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}>
          <div className="avatar">{(state.profile?.name || 'AJ').substring(0,2).toUpperCase()}</div>
          <div className="topbar-profile-info hide-on-mobile">
            <div className="topbar-profile-name">{state.profile?.name}</div>
            <div className="topbar-profile-sub">{state.profile?.handle}</div>
          </div>
          <svg className="topbar-caret hide-on-mobile" width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginLeft: '4px' }}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
          {dropdownOpen && (
            <div className="topbar-dropdown open glass" onClick={(e) => e.stopPropagation()}>
              <div className="topbar-dropdown-header">
                <div className="avatar">{(state.profile?.name || 'AJ').substring(0,2).toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{state.profile?.name}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--text3)' }}>{state.profile?.handle}</div>
                </div>
              </div>
              <NavLink to="/my-applications" className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                <span>📋</span><span>Applications</span>
              </NavLink>
              <div className="topbar-dropdown-item" onClick={() => { dispatch({ type: 'OPEN_PROFILE_MODAL' }); setDropdownOpen(false); }}>
                <span>👤</span><span>My Profile</span>
              </div>
              <NavLink to="/settings" className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                <span>⚙️</span><span>Settings</span>
              </NavLink>
              <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }}></div>
              <div className="topbar-dropdown-item" style={{ color: 'var(--red)' }} onClick={() => { localStorage.clear(); window.location.reload(); }}>
                <span>🚪</span><span>Sign Out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
