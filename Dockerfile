
FROM node:14.17.0-alpine

# Create app directory
WORKDIR /var/www/backend

# Install app dependencies - For NPM use: `COPY package.json package-lock.lock ./`
COPY package.json yarn.lock ./ 
# For NPM use: `RUN npm ci`
RUN yarn --pure-lockfile

RUN yarn install
# Copy important files - Add ormconfig.ts here if using Typeorm
COPY .eslintrc.js nest-cli.json tsconfig.json tsconfig.build.json ./

# Copy env
COPY .env /var/www/backend/.env

# Add storage folder to the container (If you want to add other folder contents to the container)
COPY . . 
# ADD storage /var/www/backend/storage
EXPOSE 5100
# Entrypoint command - Replace `"yarn"` with `"npm", "run"` if you are using NPM as your package manager.
# You can update this to run other NodeJS apps
CMD [ "yarn", "start:prod"]