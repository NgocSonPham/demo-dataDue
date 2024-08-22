FROM node:18-alpine as base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* ./
COPY ckeditor5/* ./ckeditor5/
RUN yarn --frozen-lockfile

FROM base AS runner
ARG env
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build:${env}
RUN npm install serve -g

EXPOSE 3004
CMD ["npm", "run", "serve"]