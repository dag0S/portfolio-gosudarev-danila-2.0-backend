FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run postinstall

RUN npm run build

ENV NODE_ENV=production

ENV PORT=4321

EXPOSE 4321

CMD ["npm", "run", "start"]