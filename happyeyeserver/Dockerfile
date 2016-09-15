FROM node:4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --production

COPY server.js elasticsearch.js /usr/src/app/

EXPOSE 3000 

CMD [ "npm", "start" ]

