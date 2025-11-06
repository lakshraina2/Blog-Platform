import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get('/api/comments/count/all');
        setCommentsCount(res.data.count || 0);
      } catch (e) {
        // ignore
      }
    };
    fetchCount();
    const id = setInterval(fetchCount, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="brand">@myblog</Link>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-link active">
          <span className="icon">🏠</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/" className="sidebar-link">
          <span className="icon">📝</span>
          <span>Posts</span>
        </Link>
        <Link to="/comments" className="sidebar-link">
          <span className="icon">💬</span>
          <span>Comments</span>
          <span className="badge">{commentsCount}</span>
        </Link>
        <Link to="/settings" className="sidebar-link">
          <span className="icon">⚙️</span>
          <span>Settings</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        {user ? (
          <Link to={`/profile/${user.id}`} className="profile-chip">
            <span className="avatar-fallback">{user.username?.[0]?.toUpperCase() || 'U'}</span>
            <div className="profile-meta">
              <strong>{user.username}</strong>
              <small>{user.email}</small>
            </div>
          </Link>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{width: '100%'}}>Sign in</Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;


