import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await axios.put(`/api/users/${user.id}`, { bio, avatar });
      setMessage('Saved');
      // Optimistically refresh local user cache
      const next = { ...user, bio: res.data.bio, avatar: res.data.avatar };
      localStorage.setItem('user', JSON.stringify(next));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <div className="container">
      <div className="settings">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-grid">
          <section className="card account-card">
            <div className="account">
              <div className="account-avatar">
                <span>{user?.username?.[0]?.toUpperCase() || 'U'}</span>
              </div>
              <div className="account-meta">
                <strong className="account-name">{user?.username || 'User'}</strong>
                <small className="account-email">{user?.email || 'email@example.com'}</small>
              </div>
            </div>
          </section>

          <section className="card pref-card">
            <h2>Preferences</h2>
            <p className="muted">Theme and UI preferences live in the navbar toggle.</p>
          </section>

          <section className="card form-card">
            <h2>Profile</h2>
            <form onSubmit={handleSave} className="settings-form">
              <div className="form-group">
                <label htmlFor="avatar">Avatar URL</label>
                <input id="avatar" type="url" placeholder="https://..." value={avatar} onChange={(e) => setAvatar(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" rows="3" placeholder="Tell us about yourself" value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                {message && <span className="muted" style={{marginLeft:'8px'}}>{message}</span>}
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;


