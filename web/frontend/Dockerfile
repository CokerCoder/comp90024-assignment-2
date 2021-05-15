FROM node:16.0.0-alpine as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci
COPY . /app
RUN npm run build


FROM node:16.0.0-alpine
WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]