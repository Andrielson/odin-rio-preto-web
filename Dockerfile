# syntax=docker/dockerfile:1
# Install dependencies only when needed
FROM node:14-alpine3.14 AS installer

RUN apk add --no-cache libc6-compat

WORKDIR /usr/local/src

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

################################################################################
# Rebuild the source code only when needed
FROM node:14-alpine3.14 AS builder

WORKDIR /usr/local/src

COPY . .

COPY --from=installer /usr/local/src/node_modules ./node_modules

RUN --mount=type=secret,id=envlocal,dst=./.env.local yarn build && yarn install --production --ignore-scripts --prefer-offline

################################################################################
# Production image, copy all the files and run next
FROM node:14-alpine3.14 AS runner

WORKDIR /srv

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /usr/local/src/next.config.js ./
COPY --from=builder /usr/local/src/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/local/src/.next ./.next
COPY --from=builder /usr/local/src/node_modules ./node_modules
COPY --from=builder /usr/local/src/package.json ./package.json

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]