# backend/Dockerfile
FROM php:8.3-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy all files (including .env if needed for local dev — but Render uses env vars)
COPY . /var/www

# Install PHP dependencies (optimized for production)
RUN composer install --no-dev --optimize-autoloader

# Make storage and cache directories writable
RUN chmod -R 777 storage bootstrap/cache

# Create startup script that runs on every container boot
RUN echo '#!/bin/sh\n\
set -e\n\
echo "→ Clearing config, route, and app cache..."\n\
php artisan config:clear\n\
php artisan route:clear\n\
php artisan cache:clear\n\
\n\
echo "→ Running migrations..."\n\
php artisan migrate --force\n\
\n\
echo "→ Starting Laravel server on port $PORT..."\n\
exec php artisan serve --host=0.0.0.0 --port=$PORT\n\
' > /start.sh && chmod +x /start.sh

# Expose port (Render uses $PORT env var)
EXPOSE 8000

# Run the startup script
CMD ["/start.sh"]
