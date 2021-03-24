FROM node:14
WORKDIR /usr/app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "server/index.js"]