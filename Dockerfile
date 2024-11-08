# Base image
FROM node:18-alpine as base

WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

COPY . .

ENV NODE_OPTIONS=--max-old-space-size=4096

RUN yarn build:${env}

# Setup Express server to handle custom MIME
FROM node:18-alpine
WORKDIR /app

COPY --from=base /app /app

# Install Express and serve-static
RUN yarn add express serve-static

# Create server.js with custom MIME handling
RUN echo "const express = require('express');" > server.js && \
    echo "const app = express();" >> server.js && \
    echo "app.use(express.static('dist'));" >> server.js && \
    echo "app.get('/.well-known/apple-app-site-association', (req, res) => {" >> server.js && \
    echo "  res.type('application/json');" >> server.js && \
    echo "  res.sendFile(__dirname + '/dist/.well-known/apple-app-site-association');" >> server.js && \
    echo "});" >> server.js && \
    echo "app.listen(8080);" >> server.js

EXPOSE 8080
CMD ["node", "server.js"]