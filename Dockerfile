FROM node:lts-alpine

ARG APP_DIR=app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY package*.json ./
RUN npm install --production

COPY . .
EXPOSE 5051 5052
CMD ["npm", "run", "start-core"]
