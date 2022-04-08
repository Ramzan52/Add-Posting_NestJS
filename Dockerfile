# Stage 1 - Build
FROM node:16-bullseye-slim as builder
WORKDIR /usr/src/app

# Install all deps including devDependencies
COPY . .
RUN yarn install --frozen-lockfile && yarn build

# Stage 2 - Package
FROM node:16-bullseye-slim as app
WORKDIR /usr/src/app

# Install deps for production only
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN yarn install --production

# Copy builded source from the upper builder stage
COPY --from=builder /usr/src/app/dist .

CMD ["node", "dist/main.js"]