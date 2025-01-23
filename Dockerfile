FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /eduVirt
WORKDIR /eduVirt

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM nginx:1.27-alpine-slim AS production
ENV API_URL=http://localhost:8080/eduVirt/api
ENV OVIRT_ENGINE_URL=http://localhost:8080/
ENV BACKEND_ADDRESS=localhost

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /eduVirt/build/client /usr/share/nginx/html/eduVirt

COPY docker/nginx.conf /etc/nginx/templates/default.conf.template

COPY docker/entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh

WORKDIR /eduVirt
COPY docker/env-config.js.template ./

EXPOSE 80
