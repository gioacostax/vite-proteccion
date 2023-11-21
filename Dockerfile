FROM nginx:1.15.12-alpine

RUN apk add nginx-mod-http-headers-more

ENV TZ='America/Bogota'

COPY ./nginx  /etc/nginx
COPY ./build/ /usr/share/nginx/html

# Copy shell script to container
COPY docker-entrypoint.sh /

# Make shell script executable
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
