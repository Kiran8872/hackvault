import { useApp } from '../store/AppContext';
import type { Application } from '../types';

export default function MyApplications() {
  const { state } = useApp();

  return (
    <div className="page active">
      <div className="page-header">
        <div className="page-title">My Applications</div>
        <div className="page-desc">Track your hackathon application pipeline</div>
      </div>

      <div id="applications-list">
        {state.applications.length === 0 ? (
          <div className="app-empty">
            <div className="app-empty-icon">📋</div>
            <div className="app-empty-title">No applications yet</div>
            <div className="app-empty-sub">Explore hackathons and apply to see them here!</div>
          </div>
        ) : (
          state.applications.map((app: Application) => (
            <div key={app.hackId} className="app-card">
              <div className="app-card-header">
                <div>
                  <div className="app-card-title">{app.hackEmoji} {app.hackTitle}</div>
                  <div className="app-card-org">{app.hackOrg}</div>
                </div>
                <span className={`app-stage-pill ${app.stage}`}>{app.stage.toUpperCase()}</span>
              </div>
              <div className="app-meta-row">
                <div className="app-meta-item">📅 Applied on <strong>{new Date(app.appliedAt).toLocaleDateString()}</strong></div>
                <div className="app-meta-item">👤 Role: <strong>{app.role}</strong></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
