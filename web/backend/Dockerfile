FROM alpine:3.11

ENV NODE_VERSION 16.0.0

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm cache clean --force && npm install --silent

COPY . /app
EXPOSE 8000


CMD ["npm","run","start"]

