
FROM node:16.14.2-bullseye

# Create app directory
WORKDIR /var/www/backend

COPY package.json yarn.lock ./ 
RUN yarn --pure-lockfile

RUN yarn install
COPY .eslintrc.js nest-cli.json tsconfig.json tsconfig.build.json ./

# Copy env
COPY .env /var/www/backend/.env

COPY . . 

RUN yarn build

EXPOSE 5100

CMD [ "node", "dist/main"]