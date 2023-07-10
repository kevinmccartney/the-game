FROM node:18-alpine

WORKDIR /var/www

COPY . ./the-game-client

WORKDIR /var/www/the-game-client

RUN npm cache clean --force && \
    npm install -g npm@latest && \
    npm install

RUN ls -la

RUN cat package.json

RUN npm i --verbose --timeout=60000

RUN npm run build

CMD node docker-entry.mjs