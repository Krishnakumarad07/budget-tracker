# Budget Tracker - Setup Guide

## Authentication System
Simple token-based authentication (Sanctum removed)

## Quick Start

### 1. Backend Setup
```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# For SQLite (default):
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Create database file (if using SQLite)
touch database/database.sqlite

# Run migrations
php artisan migrate

# Start server
php artisan serve
```

Backend will run at: http://127.0.0.1:8000

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://127.0.0.1:8000/api" > .env

# Start development server
npm run dev
```

Frontend will run at: http://localhost:5173

## How Authentication Works

1. **Registration/Login**: Returns a token
2. **Frontend**: Stores token in localStorage
3. **API Requests**: Sends token as `Bearer {token}` in Authorization header
4. **Backend**: Validates token and allows/denies access

## Testing the API

### Register
```bash
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

Response:
```json
{
  "message": "User registered",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "currency": "INR"
  },
  "token": "your-80-character-token-here"
}
```

### Login
```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Access Protected Route
```bash
curl -X GET http://127.0.0.1:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## File Structure

```
project/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   └── TransactionController.php
│   │   │   └── Middleware/
│   │   │       └── AuthenticateWithToken.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Category.php
│   │       └── Transaction.php
│   ├── database/
│   │   └── migrations/
│   │       └── 2025_01_01_000002_add_api_token_to_users_table.php
│   ├── routes/
│   │   └── api.php
│   └── public/
│       └── index.php
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── lib/
    │   │   ├── api.ts
    │   │   └── auth.ts
    │   └── pages/
    └── public/

```

## All Files Committed

✅ **Total Files**: 174
✅ **Source Files**: 81
✅ **Public Files**: 8

All directories including `src/`, `public/`, `app/`, `database/`, etc. are fully committed to git.

## Common Issues

### CORS Errors
- Check `backend/config/cors.php`
- Ensure frontend URL is in `allowed_origins`
- Restart Laravel server after changes

### Token Not Working
- Check Authorization header format: `Bearer YOUR_TOKEN`
- Verify token is stored in localStorage
- Check backend logs for validation errors

### Database Errors
- Ensure database exists and is writable
- Run migrations: `php artisan migrate`
- Check .env database configuration

## Next Steps

1. Start backend server
2. Run migrations
3. Start frontend server
4. Register a new account
5. Login and start tracking your budget!

For detailed authentication flow, see AUTH_IMPLEMENTATION.md
