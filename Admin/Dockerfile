FROM node:18.16-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        gcc \
        g++ \
        git \
    && npm install \
    && apk del .gyp python3 make gcc g++ git

# Bundle app source
COPY . .

#RUN npm run build

EXPOSE 8080
CMD [ "npm", "run", "dev" ]
