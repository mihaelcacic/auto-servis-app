
FROM node:25-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["node", "server.js"]