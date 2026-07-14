FROM node:20-alpine AS deps
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json
RUN npm ci

FROM deps AS build
COPY server server
RUN npx prisma generate --schema=server/prisma/schema.prisma
RUN npm run build --workspace server

FROM node:20-alpine AS runtime
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json
RUN npm ci --omit=dev

COPY server/prisma server/prisma
RUN npx prisma generate --schema=server/prisma/schema.prisma

COPY --from=build /app/server/dist server/dist
COPY server/docker-entrypoint.sh server/docker-entrypoint.sh
RUN chmod +x server/docker-entrypoint.sh

WORKDIR /app/server
EXPOSE 4000
ENTRYPOINT ["./docker-entrypoint.sh"]
