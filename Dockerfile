FROM node:5

RUN npm install pm2 -g

RUN mkdir /src
WORKDIR /src

COPY package.json /src/package.json
RUN npm install --production

CMD ["pm2", "start", "index.js", "--no-daemon"]

COPY . .
