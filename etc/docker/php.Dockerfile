FROM php:8.1-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    cron \
    unzip \
    redis-tools

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

RUN mkdir -p /var/www
WORKDIR /var/www
COPY ./ /var/www/

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

RUN echo "memory_limit=1024M" >> /usr/local/etc/php/conf.d/php.ini
RUN echo "allow_url_fopen=on" >> /usr/local/etc/php/conf.d/php.ini

##############
#
#WORKDIR /app
#
#RUN wget https://github.com/FriendsOfPHP/pickle/releases/download/v0.7.9/pickle.phar \
#    && mv pickle.phar /usr/local/bin/pickle \
#    && chmod +x /usr/local/bin/pickle
#
#RUN apk --update upgrade \
#    && apk add --no-cache autoconf automake make gcc g++ bash icu-dev libzip-dev rabbitmq-c rabbitmq-c-dev \
#    && docker-php-ext-install -j$(nproc) \
#        bcmath \
#        opcache \
#        intl \
#        zip \
#        pdo_mysql
#
#RUN pickle install apcu@5.1.21
#
#ADD etc/infrastructure/php/extensions/rabbitmq.sh /root/install-rabbitmq.sh
#ADD etc/infrastructure/php/extensions/xdebug.sh /root/install-xdebug.sh
#RUN apk add git
#RUN sh /root/install-rabbitmq.sh
#RUN sh /root/install-xdebug.sh
#
#RUN docker-php-ext-enable \
#        amqp \
#        apcu \
#        opcache
#
#RUN curl -sS https://get.symfony.com/cli/installer | bash -s - --install-dir /usr/local/bin
#
#COPY etc/infrastructure/php/ /usr/local/etc/php/
#
## allow non-root users have home
#RUN mkdir -p /opt/home
#RUN chmod 777 /opt/home
#ENV HOME /opt/home
