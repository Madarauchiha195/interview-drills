FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g nodemon

RUN npm ci --include=dev   

COPY . .

EXPOSE 4000
CMD ["npm", "run", "dev"]
