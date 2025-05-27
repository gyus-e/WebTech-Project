FROM docker.io/node:22-alpine
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 4200
ENTRYPOINT ["npx", "ng", "serve", "--host", "0.0.0.0"]