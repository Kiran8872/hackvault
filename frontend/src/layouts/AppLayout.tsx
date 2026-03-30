import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useApp } from '../store/AppContext';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import IdeaDrawer from '../components/ideas/IdeaDrawer';
import { SubmitIdeaModal, ProfileModal } from '../components/modals/Modals';
import { ApplyModal } from '../components/modals/ApplyModal';
import type { Toast } from '../types';

export default function AppLayout() {
  const { state } = useApp();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className={`app-root ${state.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="content-wrapper">
          <Outlet />
        </main>
      </div>
      
      {/* Detail Views & Overlays */}
      <IdeaDrawer />
      <SubmitIdeaModal />
      <ProfileModal />
      <ApplyModal />
      
      {/* Global Notifications (Toasts) */}
      <div className="toast-container">
        {state.toasts.map((t: Toast) => (
          <div key={t.id} className={`toast shimmer ${t.type}`}>
            <span className="toast-icon">
              {t.type === 'success' ? '✨' : t.type === 'error' ? '🚫' : '💡'}
            </span>
            <div className="toast-message">{t.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
