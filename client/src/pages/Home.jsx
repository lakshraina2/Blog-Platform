import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="home-header">
        <h1>Welcome to Blog Platform</h1>
        <p>Discover amazing stories and share your thoughts</p>
      </div>
      
      <div className="posts-grid">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Be the first to create one!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  {post.avatar && <img src={post.avatar} alt={post.username} className="avatar" />}
                  <span className="author-name">{post.username}</span>
                </div>
                <span className="post-date">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              <Link to={`/post/${post.id}`} className="post-link">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">
                  {post.content.length > 200
                    ? post.content.substring(0, 200) + '...'
                    : post.content}
                </p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

