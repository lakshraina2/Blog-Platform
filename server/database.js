const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = process.env.DB_PATH || './blog.db';
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      bio TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Comments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      post_id INTEGER NOT NULL,
      author_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
    CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
  `);

  console.log('Database initialized successfully');
}

// User model methods
const User = {
  create: (username, email, password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(username, email, hashedPassword);
    return result.lastInsertRowid;
  },

  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  findByUsername: (username) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT id, username, email, bio, avatar, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  },

  update: (id, fields) => {
    const updates = [];
    const values = [];
    
    if (fields.bio !== undefined) {
      updates.push('bio = ?');
      values.push(fields.bio);
    }
    if (fields.avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(fields.avatar);
    }
    
    if (updates.length === 0) return false;
    
    values.push(id);
    const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return true;
  }
};

// Post model methods
const Post = {
  create: (title, content, authorId) => {
    const stmt = db.prepare('INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)');
    const result = stmt.run(title, content, authorId);
    return result.lastInsertRowid;
  },

  findAll: () => {
    const stmt = db.prepare(`
      SELECT p.*, u.username, u.avatar 
      FROM posts p 
      JOIN users u ON p.author_id = u.id 
      ORDER BY p.created_at DESC
    `);
    return stmt.all();
  },

  findById: (id) => {
    const stmt = db.prepare(`
      SELECT p.*, u.username, u.avatar 
      FROM posts p 
      JOIN users u ON p.author_id = u.id 
      WHERE p.id = ?
    `);
    return stmt.get(id);
  },

  findByAuthor: (authorId) => {
    const stmt = db.prepare(`
      SELECT p.*, u.username, u.avatar 
      FROM posts p 
      JOIN users u ON p.author_id = u.id 
      WHERE p.author_id = ? 
      ORDER BY p.created_at DESC
    `);
    return stmt.all(authorId);
  },

  update: (id, title, content) => {
    const stmt = db.prepare('UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(title, content, id);
    return true;
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
    stmt.run(id);
    return true;
  }
};

// Comment model methods
const Comment = {
  create: (content, postId, authorId) => {
    const stmt = db.prepare('INSERT INTO comments (content, post_id, author_id) VALUES (?, ?, ?)');
    const result = stmt.run(content, postId, authorId);
    return result.lastInsertRowid;
  },

  findByPost: (postId) => {
    const stmt = db.prepare(`
      SELECT c.*, u.username, u.avatar 
      FROM comments c 
      JOIN users u ON c.author_id = u.id 
      WHERE c.post_id = ? 
      ORDER BY c.created_at ASC
    `);
    return stmt.all(postId);
  },

  findById: (id) => {
    const stmt = db.prepare(`
      SELECT c.*, u.username, u.avatar 
      FROM comments c 
      JOIN users u ON c.author_id = u.id 
      WHERE c.id = ?
    `);
    return stmt.get(id);
  },

  update: (id, content) => {
    const stmt = db.prepare('UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(content, id);
    return true;
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
    stmt.run(id);
    return true;
  }
};

module.exports = { db, initDatabase, User, Post, Comment };

