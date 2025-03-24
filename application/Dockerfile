FROM node:22-alpine3.19

WORKDIR /app
COPY . .

RUN npm i
RUN npx tsc -b tsconfig.json
EXPOSE 443

CMD ["node", "compiled/server.js", "--host"]
