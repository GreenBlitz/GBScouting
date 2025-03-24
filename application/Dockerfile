FROM node:22-alpine3.19

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY node_modules package.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 443

CMD ["node", "compiled/server.js", "--host"]
