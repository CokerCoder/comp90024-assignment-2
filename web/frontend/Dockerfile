FROM node:16.0.0-alpine as builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --silent
RUN npm install react-scripts@4.0.3 -g --silent

COPY . .

RUN npm run build




# FROM node:16.0.0-alpine
# RUN npm run start
# WORKDIR /app
# COPY --from=builder /app/build .
# EXPOSE 4000
# CMD ["serve", "-p","4000","-s","."]

