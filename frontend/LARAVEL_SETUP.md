# Laravel API Setup Instructions

## Quick Start Guide

### 1. Create Laravel Project
```bash
composer create-project laravel/laravel budget-tracker-api
cd budget-tracker-api
```

### 2. Setup Database in phpMyAdmin
1. Open phpMyAdmin (usually at http://localhost/phpmyadmin)
2. Create a new database called `budget_tracker`
3. Note your MySQL username and password

### 3. Configure Laravel Environment
Edit `.env` file in your Laravel project:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=budget_tracker
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 4. Install Laravel Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 5. Update User Model
Edit `app/Models/User.php` and add `currency` to the `$fillable` array:
```php
protected $fillable = [
    'name',
    'email',
    'password',
    'currency', // Add this line
];
```

### 6. Configure Sanctum
Edit `app/Http/Kernel.php` and add to the `api` middleware group:
```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

### 7. Copy Backend Files
Copy all files from the `laravel-api` folder in this project to your Laravel project:

- Copy `laravel-api/app/Http/Controllers/Api/AuthController.php`
  → to `app/Http/Controllers/Api/AuthController.php`

- Copy `laravel-api/routes/api.php`
  → to `routes/api.php`

- Copy `laravel-api/database/migrations/2024_01_01_000000_add_currency_to_users_table.php`
  → to `database/migrations/2024_01_01_000000_add_currency_to_users_table.php`

- Copy `laravel-api/config/cors.php`
  → to `config/cors.php`

### 8. Run Migrations
```bash
php artisan migrate
```

### 9. Start Laravel Server
```bash
php artisan serve
```

Your API will be running at: `http://127.0.0.1:8000/api`

### 10. Test API Endpoints

Using curl or Postman:

**Register:**
```bash
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","password_confirmation":"password123"}'
```

**Login:**
```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get User (requires token):**
```bash
curl -X GET http://127.0.0.1:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend Setup

The frontend is already configured! Just make sure the `.env` file exists with:
```
VITE_API_URL=http://127.0.0.1:8000/api
```

Then restart your frontend dev server:
```bash
npm run dev
```

## Troubleshooting

### CORS Issues
If you get CORS errors, make sure:
1. The `cors.php` file is copied correctly
2. Your frontend URL is in the `allowed_origins` array in `config/cors.php`
3. Restart the Laravel server

### Database Connection Issues
- Check your `.env` file has correct database credentials
- Test connection in phpMyAdmin
- Run `php artisan config:clear` to clear cached config

### Token Issues
- Make sure you're sending the token in the Authorization header as `Bearer YOUR_TOKEN`
- Token is stored in localStorage in the frontend automatically

## API Endpoints Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /api/register | No | Register new user |
| POST | /api/login | No | Login user |
| POST | /api/logout | Yes | Logout user |
| GET | /api/user | Yes | Get current user |

## Next Steps

Once authentication is working, you can:
1. Add more API endpoints for transactions, categories, etc.
2. Test login/register from the frontend
3. Build out the rest of your API
