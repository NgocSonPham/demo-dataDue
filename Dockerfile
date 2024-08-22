FROM node:18-alpine as runner
ARG env
WORKDIR /app
COPY . .

RUN npm install serve -g

EXPOSE 3004
CMD ["npm", "run", "serve"]