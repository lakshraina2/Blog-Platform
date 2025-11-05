import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      setUser(response.data);
      setBio(response.data.bio || '');
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(`/api/users/${id}`, { bio });
      setUser(response.data);
      setEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!user) {
    return <div className="container">User not found</div>;
  }

  const isOwnProfile = currentUser && currentUser.id === parseInt(id);

  return (
    <div className="container">
      <div className="profile">
        <div className="profile-header">
          <div className="profile-info">
            {user.avatar && (
              <img src={user.avatar} alt={user.username} className="profile-avatar" />
            )}
            <div>
              <h1>{user.username}</h1>
              <p className="profile-email">{user.email}</p>
              {user.bio && !editing && <p className="profile-bio">{user.bio}</p>}
              {editing && (
                <div className="edit-bio">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows="3"
                  />
                  <div className="edit-actions">
                    <button onClick={handleUpdateProfile} className="btn btn-primary">
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setBio(user.bio || '');
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                  {error && <div className="error">{error}</div>}
                </div>
              )}
            </div>
          </div>
          {isOwnProfile && !editing && (
            <button onClick={() => setEditing(true)} className="btn btn-primary">
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-posts">
          <h2>Posts ({user.posts?.length || 0})</h2>
          {user.posts && user.posts.length > 0 ? (
            <div className="posts-list">
              {user.posts.map((post) => (
                <div key={post.id} className="profile-post-card">
                  <Link to={`/post/${post.id}`} className="post-link">
                    <h3>{post.title}</h3>
                    <p className="post-excerpt">
                      {post.content.length > 150
                        ? post.content.substring(0, 150) + '...'
                        : post.content}
                    </p>
                    <span className="post-date">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-posts">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

