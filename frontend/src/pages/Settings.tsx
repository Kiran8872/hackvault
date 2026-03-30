import { useState } from 'react';
import { useApp } from '../store/AppContext';

export default function Settings() {
  const { state, dispatch, toast } = useApp();
  const [activeTab, setActiveTab] = useState('account');

  const handleReset = () => {
    if (window.confirm('Reset everything to defaults?')) {
      dispatch({ type: 'RESET_ALL' });
      toast('Settings reset to default', 'info');
    }
  };

  return (
    <div className="page active">
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--text3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Preferences</div>
      <div className="page-title" style={{ marginBottom: '24px' }}>Settings</div>

      <div className="settings-layout">
        <div className="settings-nav">
          {['account', 'appearance', 'notifications', 'privacy', 'danger'].map(tab => (
            <div 
              key={tab} 
              className={`settings-nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'account' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <div className="settings-section-title">Profile Information</div>
                <div className="settings-section-desc">Update your display name and handle visible to the community.</div>
              </div>
              <div className="settings-section-body">
                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <input 
                    className="form-input" 
                    value={state.profile.name} 
                    onChange={e => dispatch({ type: 'SET_PROFILE', profile: { ...state.profile, name: e.target.value } })}
                  />
                </div>
                <button className="btn btn-primary" onClick={() => toast('Profile updated!')}>Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="settings-section" style={{ borderColor: 'rgba(255,95,109,.25)' }}>
               <div className="settings-section-header">
                  <div className="settings-section-title" style={{ color: 'var(--red)' }}>Danger Zone</div>
               </div>
               <div className="settings-section-body">
                  <button className="btn btn-danger" onClick={handleReset}>Reset All Settings</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
