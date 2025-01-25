# Stage 1: Base
# Set up base Node.js environment and enable pnpm
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Stage 2: Build
# Install dependencies and build the app
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build:cron
RUN pnpm deploy --filter=cron --prod /prod/cron

# Stage 3: Production
# Copy the built app and run it
FROM node:20-alpine AS production

ENV NODE_ENV=production
ENV PORT=2222

WORKDIR /prod/cron

COPY --from=build /prod/cron/node_modules ./node_modules
COPY --from=build /prod/cron/dist ./dist


USER node

EXPOSE 8888

CMD [ "node", "dist/main.js" ]