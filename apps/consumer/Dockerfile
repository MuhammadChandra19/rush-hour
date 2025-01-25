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
RUN pnpm build:consumer
RUN pnpm deploy --filter=consumer --prod /prod/consumer

# Stage 3: Production
# Copy the built app and run it
FROM node:20-alpine AS production

WORKDIR /prod/consumer

COPY --from=build /prod/consumer/node_modules ./node_modules
COPY --from=build /prod/consumer/dist ./dist


USER node


CMD [ "node", "dist/main.js" ]