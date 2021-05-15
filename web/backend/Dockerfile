FROM node:16.0.0-alpine 
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm","run","start"]