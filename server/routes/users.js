const express = require('express');
const authMiddleware = require('../middleware/auth');
const { User, Post } = require('../database');

const router = express.Router();

// Get user profile
router.get('/:id', (req, res) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const posts = Post.findByAuthor(req.params.id);
    res.json({ ...user, posts });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (protected)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { bio, avatar } = req.body;
    User.update(req.params.id, { bio, avatar });
    const updatedUser = User.findById(req.params.id);

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

