import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Comments from '../components/Comments';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      setError('Post not found');
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`/api/posts/${id}`);
      window.location.href = '/';
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error || !post) {
    return (
      <div className="container">
        <div className="error">{error || 'Post not found'}</div>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const isAuthor = user && user.id === post.author_id;

  return (
    <div className="container">
      <div className="post-detail">
        <div className="post-header">
          <div className="post-author">
            {post.avatar && <img src={post.avatar} alt={post.username} className="avatar" />}
            <div>
              <Link to={`/profile/${post.author_id}`} className="author-name">
                {post.username}
              </Link>
              <span className="post-date">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          {isAuthor && (
            <div className="post-actions">
              <Link to={`/edit-post/${post.id}`} className="btn btn-secondary">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          )}
        </div>
        
        <h1 className="post-title">{post.title}</h1>
        <div className="post-content">{post.content}</div>
        
        <Comments postId={id} />
      </div>
    </div>
  );
};

export default PostDetail;

