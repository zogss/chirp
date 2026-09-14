# syntax=docker/dockerfile:1

# Prepares the Postgres from `docker-compose.yml`: applies the Prisma migrations and seeds it.
FROM node:22-slim

# Prisma's schema engine needs OpenSSL
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml prisma.config.ts ./
COPY prisma ./prisma

# `prisma generate` runs on install, it only needs a well-formed database URL
RUN --mount=type=cache,target=/root/.yarn/berry/cache \
  DATABASE_URL="postgresql://placeholder@localhost/placeholder" yarn install --immutable
