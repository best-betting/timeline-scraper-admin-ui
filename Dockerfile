# Build from repo root (scrapper-admin-ui/):
#   docker build -t scrapper-admin-ui .
#
# Production: nginx serves dist/ and proxies /scrapper-api → SCRAPPER_UPSTREAM.
# Bearer token from SCRAPPER_ADMIN_API_KEY (k8s secret), not the JS bundle.
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_SCRAPPER_API_BASE_URL=/scrapper-api
ENV VITE_SCRAPPER_API_BASE_URL=$VITE_SCRAPPER_API_BASE_URL
ARG VITE_SCRAPPER_ADMIN_API_KEY=
ENV VITE_SCRAPPER_ADMIN_API_KEY=$VITE_SCRAPPER_ADMIN_API_KEY

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
RUN apk add --no-cache gettext

ARG CACHEBUST=
RUN test -n "$CACHEBUST" || true

COPY nginx/default.conf.template /etc/nginx/scrapper/default.conf.template
COPY docker/start.sh /usr/local/bin/start.sh
RUN sed -i 's/\r$//' /usr/local/bin/start.sh \
  && chmod +x /usr/local/bin/start.sh \
  && test -x /usr/local/bin/start.sh \
  && rm -f /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

ENTRYPOINT ["/usr/local/bin/start.sh"]
