# Development Stage
FROM node:14 AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG NODE_ENV=dev
RUN npm run build:${NODE_ENV}

# Staging/Production Stage
FROM node:14-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /app/dist ./dist

ENV NODE_ENV=production

CMD ["node", "dist/main"]
