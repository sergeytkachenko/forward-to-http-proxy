FROM node:13.10.1-stretch-slim AS build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .

CMD ["node", "index.js"]

EXPOSE 8000
