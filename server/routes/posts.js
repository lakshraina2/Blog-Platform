const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { Post } = require('../database');

const router = express.Router();

// Get all posts
router.get('/', (req, res) => {
  try {
    const posts = Post.findAll();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:id', (req, res) => {
  try {
    const post = Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post (protected)
router.post('/', authMiddleware, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const postId = Post.create(title, content, req.userId);
    const post = Post.findById(postId);

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post (protected - only author)
router.put('/:id', authMiddleware, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { title, content } = req.body;
    Post.update(req.params.id, title, content);
    const updatedPost = Post.findById(req.params.id);

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post (protected - only author)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const post = Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    Post.delete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

