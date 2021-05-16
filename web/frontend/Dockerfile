# FROM node:16.1.0-alpine as builder
# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# COPY package*.json ./
# RUN npm ci --loglevel verbose
# COPY . .
# RUN npm run build


# FROM nginx:1.19.10-alpine
# COPY --from=builder /app/build /usr/share/nginx/html
# EXPOSE 4000

FROM node:16.1.0-alpine as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

FROM node:16.1.0-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/build .
EXPOSE 4000
CMD ["serve", "-p", "4000", "-s", "."]