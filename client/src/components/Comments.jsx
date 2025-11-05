import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Comments.css';

const Comments = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
    // Poll for new comments every 5 seconds
    const interval = setInterval(fetchComments, 5000);
    return () => clearInterval(interval);
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/post/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to comment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/comments', {
        content,
        postId: parseInt(postId)
      });
      setComments([...comments, response.data]);
      setContent('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="form-group">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment..."
              required
              rows="3"
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="login-prompt">
          <a href="/login">Login</a> to leave a comment
        </p>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  {comment.avatar && (
                    <img src={comment.avatar} alt={comment.username} className="avatar" />
                  )}
                  <div>
                    <span className="author-name">{comment.username}</span>
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                {user && user.id === comment.author_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="btn-delete"
                    title="Delete comment"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;

