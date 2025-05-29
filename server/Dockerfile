FROM node:22

WORKDIR /app
COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

CMD npm run dev
