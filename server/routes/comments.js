const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { Comment, Post } = require('../database');

const router = express.Router();

// Get comments for a post
router.get('/post/:postId', (req, res) => {
  try {
    const comments = Comment.findByPost(req.params.postId);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get total comments count
router.get('/count/all', (req, res) => {
  try {
    const count = Comment.countAll();
    res.json({ count });
  } catch (error) {
    console.error('Error getting comments count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get comments count for a post
router.get('/count/post/:postId', (req, res) => {
  try {
    const count = Comment.countForPost(req.params.postId);
    res.json({ count });
  } catch (error) {
    console.error('Error getting post comments count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment (protected)
router.post('/', authMiddleware, [
  body('content').trim().notEmpty().withMessage('Comment content is required'),
  body('postId').isInt().withMessage('Valid post ID is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, postId } = req.body;

    // Verify post exists
    const post = Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const commentId = Comment.create(content, postId, req.userId);
    const comment = Comment.findById(commentId);

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update comment (protected - only author)
router.put('/:id', authMiddleware, [
  body('content').trim().notEmpty().withMessage('Comment content is required')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    const { content } = req.body;
    Comment.update(req.params.id, content);
    const updatedComment = Comment.findById(req.params.id);

    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment (protected - only author)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const comment = Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    Comment.delete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

