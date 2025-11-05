# Blog Platform with Comments and User Profiles

A full-stack blogging platform built with React and Node.js/Express, featuring user authentication, blog posts, comments, and user profiles.

## Features

- **User Authentication**: Sign up and login with JWT-based authentication
- **Blog Posts**: Create, read, update, and delete blog posts
- **Comments**: Add comments to posts with real-time updates
- **User Profiles**: View user profiles with their posts
- **Protected Routes**: Secure routes that require authentication
- **Database**: SQLite database with proper relationships between users, posts, and comments

## Tech Stack

### Backend
- Node.js & Express
- SQLite (better-sqlite3)
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Vite for build tooling
- Modern CSS

## Project Structure

```
blog-platform/
├── server/
│   ├── index.js           # Express server entry point
│   ├── database.js        # Database models and initialization
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   └── routes/
│       ├── auth.js        # Authentication routes
│       ├── posts.js       # Post CRUD routes
│       ├── comments.js    # Comment CRUD routes
│       └── users.js       # User profile routes
├── client/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (AuthContext)
│   │   └── App.jsx        # Main app component
│   └── package.json
└── package.json
```

## Installation

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   JWT_SECRET=your-secret-key-change-this-in-production
   PORT=5000
   DB_PATH=./blog.db
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```
   
   This will start both the backend server (port 5000) and frontend dev server (port 3000).

   Or run them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a single post
- `POST /api/posts` - Create a post (protected)
- `PUT /api/posts/:id` - Update a post (protected, author only)
- `DELETE /api/posts/:id` - Delete a post (protected, author only)

### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments` - Create a comment (protected)
- `PUT /api/comments/:id` - Update a comment (protected, author only)
- `DELETE /api/comments/:id` - Delete a comment (protected, author only)

### Users
- `GET /api/users/:id` - Get user profile with posts
- `PUT /api/users/:id` - Update user profile (protected, own profile only)

## Database Schema

### Users Table
- `id` (INTEGER PRIMARY KEY)
- `username` (TEXT UNIQUE)
- `email` (TEXT UNIQUE)
- `password` (TEXT - hashed)
- `bio` (TEXT)
- `avatar` (TEXT)
- `created_at` (DATETIME)

### Posts Table
- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT)
- `content` (TEXT)
- `author_id` (INTEGER - Foreign Key to users)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Comments Table
- `id` (INTEGER PRIMARY KEY)
- `content` (TEXT)
- `post_id` (INTEGER - Foreign Key to posts)
- `author_id` (INTEGER - Foreign Key to users)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Authenticate with your credentials
3. **Create Posts**: Write and publish blog posts
4. **View Posts**: Browse all posts on the home page
5. **Add Comments**: Comment on any post (requires login)
6. **Edit/Delete**: Edit or delete your own posts and comments
7. **View Profiles**: Click on usernames to view user profiles

## Testing

To test the application:

1. Create multiple user accounts
2. Create posts from different users
3. Add comments to posts
4. Try editing/deleting posts and comments (you can only edit/delete your own)
5. View different user profiles

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes for authenticated actions
- Author-only permissions for editing/deleting
- Input validation on all endpoints
- SQL injection protection with prepared statements

## Future Enhancements

- User avatars upload
- Rich text editor for posts
- Like/upvote system
- Post categories/tags
- Search functionality
- Pagination
- Real-time notifications
- Email verification

