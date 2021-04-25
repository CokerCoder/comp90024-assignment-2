FROM node:16.0.0-alpine as builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci --silent
RUN npm install react-scripts@4.0.3 -g --silent

COPY . .

RUN npm run build


FROM node:16.0.0-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/build .
EXPOSE 4000

CMD ["serve", "-s","build","-l","4000"]

