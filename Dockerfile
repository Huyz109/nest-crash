FROM node:22-alpine as build-stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:22-alpine as production-stage

WORKDIR /app

COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/package.json ./package.json
COPY --from=build-stage /app/node_modules ./node_modules

RUN npm install --prod

EXPOSE 3000

CMD ["pm2-runtime", "./app/main.js"]
