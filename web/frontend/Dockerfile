FROM node:16.0.0-alpine as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
# RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY - from=builder /app/build /usr/share/nginx/html
COPY - from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]