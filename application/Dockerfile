FROM node:22-alpine3.19

WORKDIR /app
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm install
RUN npm run build

EXPOSE 443

CMD ["node", "compiled/server.js", "--host"]
