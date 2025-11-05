# Setup Instructions

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

2. **Create a `.env` file in the root directory:**
   ```
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   DB_PATH=./blog.db
   ```

3. **Start the development servers:**
   
   Option 1: Run both servers together (recommended)
   ```bash
   npm run dev
   ```
   
   Option 2: Run servers separately
   
   Terminal 1 (Backend):
   ```bash
   npm run server
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## First Steps

1. Open http://localhost:3000 in your browser
2. Click "Sign Up" to create a new account
3. Create your first blog post
4. Add comments to posts
5. View user profiles

## Troubleshooting

- **Port already in use**: Change the PORT in `.env` or kill the process using the port
- **Database errors**: Delete `blog.db` and restart the server (database will be recreated)
- **CORS errors**: Make sure the backend is running on port 5000 and frontend on port 3000

