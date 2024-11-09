FROM node:18-alpine as base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile
RUN yarn add express serve-static

FROM base AS builder
ARG env
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_OPTIONS=--max-old-space-size=4096

RUN yarn build:${env}

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

ENV NEXT_TELEMETRY_DISABLED 1

# Create server.js with custom MIME handling
RUN echo "const express = require('express');" > server.js && \
    echo "const app = express();" >> server.js && \
    echo "const port = process.env.PORT;" >> server.js && \
    echo "app.use(express.static('dist'));" >> server.js && \
    echo "app.get('/.well-known/apple-app-site-association', (req, res) => {" >> server.js && \
    echo "  res.type('application/json');" >> server.js && \
    echo "  res.sendFile(__dirname + '/dist/.well-known/apple-app-site-association');" >> server.js && \
    echo "});" >> server.js && \
    echo "app.listen(port, () => console.log('Server running on port ' + port));" >> server.js

# Start the server
CMD ["node", "server.js"]