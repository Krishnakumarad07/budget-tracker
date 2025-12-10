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

# Copy application
COPY . /var/www

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Make storage writable
RUN chmod -R 777 storage bootstrap/cache

# Expose port
EXPOSE 8000

# Create startup script
RUN echo '#!/bin/sh\n\
php artisan migrate --force\n\
exec php artisan serve --host=0.0.0.0 --port=8000\n\
' > /start.sh && chmod +x /start.sh

# Run the startup script
CMD ["/start.sh"]
