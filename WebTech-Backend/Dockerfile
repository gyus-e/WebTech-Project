FROM docker.io/node:22-alpine
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm", "start"]