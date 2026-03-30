import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../store/AppContext';

const NAV_ITEMS = [
  {
    section: 'MAIN',
    items: [
      { to: '/',             icon: 'dashboard', label: 'Dashboard' },
      { to: '/hackathons',   icon: 'hackathons', label: 'Hackathons', badge: 'blue' },
      { to: '/ideas',        icon: 'ideas',     label: 'Browse Ideas' },
      { to: '/shortlist',    icon: 'shortlist',  label: 'Shortlist', badge: 'gold' },
      { to: '/my-applications', icon: 'apps',    label: 'My Applications' },
    ],
  },
  {
    section: 'ANALYTICS',
    items: [
      { to: '/contributors', icon: 'leaderboard', label: 'Leaderboard' },
      { to: '/trends',       icon: 'trends',      label: 'Domain Trends' },
    ],
  },
];

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    hackathons: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
        <path d="M4 22h16" /><path d="M10 22V8a4 4 0 014-4v0a4 4 0 014 4v14" />
        <path d="M6 8v6c0 2.8 2.2 5.2 5 5.8" />
      </svg>
    ),
    ideas: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 00-4 12.7V17a1 1 0 001 1h6a1 1 0 001-1v-2.3A7 7 0 0012 2z" />
        <path d="M9 21h6" /><path d="M10 17v-2" /><path d="M14 17v-2" />
      </svg>
    ),
    shortlist: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    apps: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="9" y1="6" x2="15" y2="6" />
        <line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="12" y2="14" />
      </svg>
    ),
    leaderboard: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    trends: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" />
        <rect x="17" y="3" width="4" height="18" rx="1" />
      </svg>
    ),
    settings: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  };
  return icons[name] || <span>•</span>;
}

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const collapsed = state.sidebarCollapsed;
  const handleToggle = () => dispatch({ type: 'TOGGLE_SIDEBAR' });

  return (
    <>
      {/* Mobile Backdrop */}
      {!collapsed && (
        <div className="sidebar-backdrop mobile-only"
             style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199, backdropFilter: 'blur(4px)' }}
             onClick={handleToggle}></div>
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : 'open'}`} id="sidebar">
        {/* Logo */}
        <div className="logo-wrap" onClick={() => window.location.href = '/'}>
          <div className="logo-mark shimmer"></div>
          <div className="logo-text-wrap">
            <div className="logo-title">Hack<span>Vault</span></div>
            <div className="logo-sub">Idea Platform</div>
          </div>
          <button className="sidebar-toggle hide-on-mobile" onClick={(e) => { e.stopPropagation(); handleToggle(); }} title="Toggle sidebar" aria-label="Toggle sidebar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
            </svg>
          </button>
        </div>

        {/* Nav Sections */}
        {NAV_ITEMS.map((group) => (
          <div className="nav-section" key={group.section}>
            <div className="nav-label">{group.section}</div>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                data-tooltip={item.label}
              >
                <span className="nav-icon"><NavIcon name={item.icon} /></span>
                <span className="nav-text">{item.label}</span>
                {item.badge && <span className={`nav-dot ${item.badge}`}></span>}
              </NavLink>
            ))}
          </div>
        ))}


      </aside>
    </>
  );
}
