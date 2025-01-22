FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /eduVirt
WORKDIR /eduVirt

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM nginx:alpine AS production
ENV API_URL=http://localhost:8080/eduVirt/api
ENV OVIRT_ENGINE_LOCATION=http://localhost:8080/ovirt-engine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /eduVirt/build/client /usr/share/nginx/html/eduVirt

# COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /eduVirt
COPY docker/entrypoint.sh ./
RUN chmod 500 entrypoint.sh
COPY docker/env-config.js.template ./

EXPOSE 80
CMD ["./entrypoint.sh"]
