FROM node:18-alpine as base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* ./
COPY ckeditor5 ./ckeditor5
RUN yarn --frozen-lockfile

FROM base AS builder
ARG env
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/ckeditor5 ./ckeditor5
COPY . .
RUN yarn build:${env}

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install serve -g

EXPOSE 8080
ENV PORT=8080
CMD ["serve", "-l", "$PORT", "dist"]