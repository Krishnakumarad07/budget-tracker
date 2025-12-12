# Simple Token Authentication Implementation

## Overview
Removed Laravel Sanctum and implemented a simple custom token-based authentication system.

## Changes Made

### 1. Database Migration
- **File**: `backend/database/migrations/2025_01_01_000002_add_api_token_to_users_table.php`
- Added `api_token` column (80 characters, unique, nullable) to users table

### 2. User Model Updates
- **File**: `backend/app/Models/User.php`
- Removed `HasApiTokens` trait (Sanctum)
- Added `api_token` to fillable and hidden fields
- Added `generateToken()` method to create random 80-character tokens

### 3. Custom Authentication Middleware
- **File**: `backend/app/Http/Middleware/AuthenticateWithToken.php`
- Validates Bearer token from Authorization header
- Finds user by api_token
- Returns 401 if token is invalid or missing

### 4. Auth Controller Updates
- **File**: `backend/app/Http/Controllers/AuthController.php`
- **Register**: Creates user and generates token using `$user->generateToken()`
- **Login**: Validates credentials and generates new token
- **Logout**: Sets api_token to null
- **User**: Returns current authenticated user

### 5. Routes Configuration
- **File**: `backend/routes/api.php`
- Changed from `auth:sanctum` middleware to `auth.token` middleware
- All protected routes use custom token authentication

### 6. Middleware Registration
- **File**: `backend/bootstrap/app.php`
- Registered `auth.token` middleware alias

### 7. Removed Sanctum
- Removed from `composer.json`
- Deleted `config/sanctum.php`
- Deleted Sanctum migration file

## Authentication Flow

### Registration
1. User sends POST to `/api/register` with name, email, password, password_confirmation
2. System creates user and generates 80-character random token
3. Returns user object and token

### Login
1. User sends POST to `/api/login` with email and password
2. System validates credentials
3. Generates new token (overwrites old one)
4. Returns user object and token

### Protected Routes
1. Frontend stores token in localStorage
2. Sends token in Authorization header as `Bearer {token}`
3. Middleware validates token and finds user
4. Request proceeds if valid, returns 401 if invalid

### Logout
1. User sends POST to `/api/logout` with Bearer token
2. System sets api_token to null in database
3. Token is invalidated

## Frontend Integration

The frontend already works correctly with this implementation:
- Stores token in localStorage
- Sends Authorization: Bearer {token} header
- Handles 401 responses by redirecting to login

## Running the Application

### Backend
```bash
cd backend
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Public Routes
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Protected Routes (require Bearer token)
- `POST /api/logout` - Logout user
- `GET /api/user` - Get current user
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction

## Testing with cURL

```bash
# Register
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'

# Login
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get User (replace YOUR_TOKEN with actual token)
curl -X GET http://127.0.0.1:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Security Notes

1. Token is 80 random characters (very secure)
2. Token stored in database with unique constraint
3. Only one active token per user (new login invalidates old token)
4. Logout explicitly removes token from database
5. All tokens transmitted over HTTPS in production
6. Token never exposed in response (hidden field)

## Migration from Sanctum

If you had existing Sanctum tokens:
1. All users need to login again to get new tokens
2. Old Sanctum tokens are no longer valid
3. Run migrations to add api_token column
