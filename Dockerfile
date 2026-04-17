# Build stage
FROM ghcr.io/gohugoio/hugo:latest AS builder
COPY --chown=hugo:hugo . /src
WORKDIR /src
USER hugo
RUN hugo --minify

# Run stage
FROM nginx:alpine
COPY --from=builder /src/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
