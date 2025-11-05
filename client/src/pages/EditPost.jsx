import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CreatePost.css';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      const post = response.data;
      
      if (post.author_id !== user?.id) {
        navigate('/');
        return;
      }

      setTitle(post.title);
      setContent(post.content);
    } catch (error) {
      setError('Failed to load post');
      console.error('Error fetching post:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.put(`/api/posts/${id}`, { title, content });
      navigate(`/post/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="create-post">
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter post title"
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your post content here..."
              rows="15"
            />
          </div>
          {error && <div className="error">{error}</div>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Post'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/post/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;

