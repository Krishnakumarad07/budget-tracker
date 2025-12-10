# Use PHP 8.3 CLI with Apache (or FPM if you prefer — CLI is simpler for `php artisan serve`)
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
    libpq-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . /var/www

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader

# Generate app key (optional — you can also set via env)
# RUN php artisan key:generate --show

# Make sure storage is writable
RUN chmod -R 777 storage bootstrap/cache

# Expose port
EXPOSE 8000

# Start Laravel development server (for simplicity)
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
