FROM node:alpine

WORKDIR /app

COPY . /app

RUN yarn

CMD ["yarn", "start"]
