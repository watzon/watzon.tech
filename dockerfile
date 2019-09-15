FROM nginx:stable

COPY __sapper__/export /var/www
COPY nginx.conf /etc/nginx/conf.d/default.conf