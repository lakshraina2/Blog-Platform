import { useEffect, useState } from 'react';
import axios from 'axios';
import './CommentsDashboard.css';

const CommentsDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/posts');
        const withCounts = await Promise.all(
          res.data.map(async p => {
            try {
              const c = await axios.get(`/api/comments/count/post/${p.id}`);
              return { ...p, commentsCount: c.data.count };
            } catch { return { ...p, commentsCount: 0 }; }
          })
        );
        setPosts(withCounts);
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const toggle = async (postId) => {
    const curr = !!expanded[postId];
    if (!curr) {
      try {
        const res = await axios.get(`/api/comments/post/${postId}`);
        setExpanded(prev => ({ ...prev, [postId]: res.data }));
      } catch {
        setExpanded(prev => ({ ...prev, [postId]: [] }));
      }
    } else {
      setExpanded(prev => { const n = { ...prev }; delete n[postId]; return n; });
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1 style={{marginBottom:'16px'}}>Comments</h1>
      <div className="comments-dash">
        {posts.map(post => (
          <div key={post.id} className="card dash-item">
            <button className="dash-head" onClick={() => toggle(post.id)}>
              <span className="dash-title">{post.title}</span>
              <span className="badge">{post.commentsCount}</span>
            </button>
            {!!expanded[post.id] && (
              <div className="dash-body">
                {expanded[post.id].length === 0 ? (
                  <p className="muted">No comments</p>
                ) : (
                  expanded[post.id].map(c => (
                    <div key={c.id} className="dash-comment">
                      <div className="dash-comment-meta">
                        <strong>{c.username}</strong>
                        <small className="muted">{new Date(c.created_at).toLocaleString()}</small>
                      </div>
                      <div>{c.content}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsDashboard;


