FROM node:16.1.0-alpine 
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci --silent
COPY . .
EXPOSE 8000
CMD ["npm","run","start"]